const Groq = require("groq-sdk")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const summaryReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question"),
        intention: z.string().describe("The intention of the interviewer")
    })).describe("Exactly 3 technical questions"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question"),
        intention: z.string().describe("The intention of the interviewer")
    })).describe("Exactly 3 behavioral questions"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
    })).describe("List of skill gaps"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number"),
        focus: z.string().describe("Main focus"),
        tasks: z.array(z.string()).describe("Tasks list")
    })).describe("A day-wise preparation plan"),
    title: z.string().describe("The job title"),
})

const detailedAnswerSchema = z.object({
    quickAnswer: z.string().describe("A concise 2-3 sentence summary answer"),
    detailedExplanation: z.string().describe("An in-depth explanation covering all nuances"),
    workflowDiagram: z.string().describe("A text-based representation or description of the workflow/process"),
    jargons: z.array(z.string()).describe("Key technical terms or industry buzzwords used in the answer"),
    codeSnippet: z.string().describe("Relevant code example or pseudo-code if applicable"),
    advantages: z.array(z.string()).describe("Pros or benefits of the approach/concept"),
    limitations: z.array(z.string()).describe("Cons or constraints of the approach/concept"),
    comparison: z.string().describe("Comparison with alternative approaches or related concepts"),
    bestPractices: z.array(z.string()).describe("Industry standard best practices for this topic"),
    followUpQuestions: z.array(z.string()).describe("Potential follow-up questions an interviewer might ask")
})

async function generateQuestionsAndSummary({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview summary for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        Generate exactly 3 technical questions and 3 behavioral questions based on the candidate's profile and the job description.
        Also provide match score, skill gaps, a preparation plan, and a job title.

        Respond ONLY with a valid JSON object matching this schema:
        ${JSON.stringify(zodToJsonSchema(summaryReportSchema), null, 2)}
    `

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    })

    return JSON.parse(response.choices[0].message.content)
}

async function generateDetailedAnswer({ question, intention, type, context }) {
    let lastError;
    for (let i = 0; i < 3; i++) {
        try {
            const prompt = `Provide an extremely detailed and structured answer for the following interview question:
                Question: ${question}
                Intention: ${intention}
                Type: ${type} (Technical/Behavioral)
                Context (Resume & Job Description): ${context}

                Follow the "Question Card" structure strictly:
                - Quick Answer: Short and punchy.
                - Detailed Explanation: Comprehensive and deep.
                - Workflow Diagram: Explain the flow or step-by-step process.
                - Jargons: List relevant technical terms.
                - Code Snippet: Provide high-quality code (for technical) or STAR method structure (for behavioral).
                - Advantages & Limitations: Pros and cons.
                - Comparison: How it differs from other solutions.
                - Best Practices: What professionals do.
                - Follow-up Questions: What's next?

                Respond ONLY with a valid JSON object matching this schema:
                ${JSON.stringify(zodToJsonSchema(detailedAnswerSchema), null, 2)}
            `

            const response = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })

            return JSON.parse(response.choices[0].message.content)
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${i + 1} failed for: ${question.substring(0, 30)}... Retrying in 2s.`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    throw lastError;
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        Respond ONLY with a valid JSON object with a single field "html" containing the HTML content of the resume.
                        The resume should be tailored for the given job description and highlight the candidate's strengths.
                        The HTML should be well-formatted, visually appealing, ATS friendly, and ideally 1-2 pages when converted to PDF.
                        Do not include any explanation or markdown, just the raw JSON.
                    `

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    })

    const jsonContent = JSON.parse(response.choices[0].message.content)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateQuestionsAndSummary, generateDetailedAnswer, generateResumePdf }