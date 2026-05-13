const mongoose = require('mongoose');


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    quickAnswer: {
        type: String,
        required: [ true, "Quick Answer is required" ]
    },
    detailedExplanation: {
        type: String,
        required: [ true, "Detailed Explanation is required" ]
    },
    workflowDiagram: {
        type: String,
    },
    jargons: [ { type: String } ],
    codeSnippet: {
        type: String,
    },
    advantages: [ { type: String } ],
    limitations: [ { type: String } ],
    comparison: {
        type: String,
    },
    bestPractices: [ { type: String } ],
    followUpQuestions: [ { type: String } ]
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Behavioral question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    quickAnswer: {
        type: String,
        required: [ true, "Quick Answer is required" ]
    },
    detailedExplanation: {
        type: String,
        required: [ true, "Detailed Explanation is required" ]
    },
    workflowDiagram: {
        type: String,
    },
    jargons: [ { type: String } ],
    codeSnippet: {
        type: String,
    },
    advantages: [ { type: String } ],
    limitations: [ { type: String } ],
    comparison: {
        type: String,
    },
    bestPractices: [ { type: String } ],
    followUpQuestions: [ { type: String } ]
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    preparationPlan: [ preparationPlanSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    },
    chatQuestions: [ technicalQuestionSchema ],
    chatHistory: [
        {
            role: { type: String, enum: [ "user", "assistant" ] },
            content: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;  