const pdfParse = require("pdf-parse")
const { generateQuestionsAndSummary, generateDetailedAnswer, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

// async function generateInterViewReportController(req, res) {

//     const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
//     const { selfDescription, jobDescription } = req.body

//     const interViewReportByAi = await generateInterviewReport({
//         resume: resumeContent.text,
//         selfDescription,
//         jobDescription
//     })

//     const interviewReport = await interviewReportModel.create({
//         user: req.user.id,
//         resume: resumeContent.text,
//         selfDescription,
//         jobDescription,
//         ...interViewReportByAi
//     })

//     res.status(201).json({
//         message: "Interview report generated successfully.",
//         interviewReport
//     })

// }

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */

async function generateInterViewReportController(req, res) {
    try {


        if (!req.file && !req.body.selfDescription) {
            return res.status(400).json({ message: "Resume or self description is required." })
        }
        // const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        let resumeText = ""
        if (req.file) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = resumeContent.text
        }
        const { selfDescription, jobDescription } = req.body

        // Step 1: Generate Questions and Summary
        const summary = await generateQuestionsAndSummary({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const context = `Resume: ${resumeText}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}`

        // Step 2: Generate Detailed Answers for each question sequentially to avoid rate limits
        const technicalQuestionsDetailed = []
        for (const q of summary.technicalQuestions) {
            try {
                const details = await generateDetailedAnswer({
                    question: q.question,
                    intention: q.intention,
                    type: "technical",
                    context
                })
                technicalQuestionsDetailed.push({ ...q, ...details })
                // Small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (error) {
                console.error(`Failed technical question: ${q.question}`, error)
                technicalQuestionsDetailed.push({ ...q, quickAnswer: "Failed to generate.", detailedExplanation: "Rate limit or API error. Try refreshing." })
            }
        }

        const behavioralQuestionsDetailed = []
        for (const q of summary.behavioralQuestions) {
            try {
                const details = await generateDetailedAnswer({
                    question: q.question,
                    intention: q.intention,
                    type: "behavioral",
                    context
                })
                behavioralQuestionsDetailed.push({ ...q, ...details })
                // Small delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (error) {
                console.error(`Failed behavioral question: ${q.question}`, error)
                behavioralQuestionsDetailed.push({ ...q, quickAnswer: "Failed to generate.", detailedExplanation: "Rate limit or API error. Try refreshing." })
            }
        }

        // Step 3: Create the final report
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...summary,
            technicalQuestions: technicalQuestionsDetailed,
            behavioralQuestions: behavioralQuestionsDetailed
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("🔴 FULL ERROR:", error) // 👈 add this
        res.status(500).json({ message: error.message })
    }
}




/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }