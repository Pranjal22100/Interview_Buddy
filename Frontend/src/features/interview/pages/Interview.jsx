import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'
import { sendChatMessage } from '../services/interview.api'



const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
    { id: 'chat', label: 'AI Tutor Chat', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8" /><path d="M8 13h6" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Quick Answer</span>
                        <p>{item.quickAnswer}</p>
                    </div>

                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--detailed'>Detailed Explanation</span>
                        <p className="q-card__text">{item.detailedExplanation}</p>
                    </div>

                    {item.workflowDiagram && (
                        <div className='q-card__section'>
                            <span className='q-card__tag'>Workflow / Process</span>
                            <pre className="q-card__pre">{item.workflowDiagram}</pre>
                        </div>
                    )}

                    {item.codeSnippet && (
                        <div className='q-card__section'>
                            <span className='q-card__tag'>Code Snippet / Structure</span>
                            <pre className="q-card__code"><code>{item.codeSnippet}</code></pre>
                        </div>
                    )}

                    {item.jargons && item.jargons.length > 0 && (
                        <div className='q-card__section'>
                            <span className='q-card__tag'>Key Jargons</span>
                            <div className="q-card__list-tags">
                                {item.jargons.map((j, i) => <span key={i} className="jargon-tag">{j}</span>)}
                            </div>
                        </div>
                    )}

                    <div className="q-card__grid">
                        {item.advantages && item.advantages.length > 0 && (
                            <div className='q-card__section'>
                                <span className='q-card__tag'>Advantages</span>
                                <ul>{item.advantages.map((a, i) => <li key={i}>{a}</li>)}</ul>
                            </div>
                        )}
                        {item.limitations && item.limitations.length > 0 && (
                            <div className='q-card__section'>
                                <span className='q-card__tag'>Limitations</span>
                                <ul>{item.limitations.map((l, i) => <li key={i}>{l}</li>)}</ul>
                            </div>
                        )}
                    </div>

                    {item.comparison && (
                        <div className='q-card__section'>
                            <span className='q-card__tag'>Comparison</span>
                            <p>{item.comparison}</p>
                        </div>
                    )}

                    {item.bestPractices && item.bestPractices.length > 0 && (
                        <div className='q-card__section'>
                            <span className='q-card__tag'>Best Practices</span>
                            <ul>{item.bestPractices.map((b, i) => <li key={i}>{b}</li>)}</ul>
                        </div>
                    )}

                    {item.followUpQuestions && item.followUpQuestions.length > 0 && (
                        <div className='q-card__section'>
                            <span className='q-card__tag'>Follow-up Questions</span>
                            <ul className="follow-up-list">{item.followUpQuestions.map((f, i) => <li key={i}>{f}</li>)}</ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, getReportById, loading, getResumePdf, setReport } = useInterview()
    const { interviewId } = useParams()
    const [ chatMessage, setChatMessage ] = useState("")
    const [ chatLoading, setChatLoading ] = useState(false)
    const chatEndRef = React.useRef(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [ report?.chatHistory ])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!chatMessage.trim()) return

        const currentMessage = chatMessage
        setChatLoading(true)
        setChatMessage("")
        
        try {
            const data = await sendChatMessage(interviewId, currentMessage)
            console.log("Chat response:", data)
            
            // Immediately update state with the response from the server
            setReport(prev => ({
                ...prev,
                chatHistory: data.chatHistory || prev.chatHistory,
                chatQuestions: data.chatQuestions?.length > 0 
                    ? [ ...(prev.chatQuestions || []), ...data.chatQuestions ] 
                    : (prev.chatQuestions || [])
            }))
            setChatLoading(false) // Stop loading on success
        } catch (error) {
            console.error("Chat full error:", error)
            
            const errorMessage = error.response?.data?.message || error.message;
            const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.response?.status === 504;

            if (isTimeout) {
                console.log("Chat timed out, starting background poll...")
                // ... (rest of the polling logic stays same)
            } else {
                // Show more detailed error info
                alert(`Chat failed (${error.code || 'Network Error'}): ${errorMessage}`)
                setChatLoading(false)
            }
        } finally {
            // Only turn off loading if we didn't enter the timeout/polling flow
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    // Auto-poll if report is missing detailed answers
    useEffect(() => {
        let pollInterval;
        // If the report exists but has no detailed answers yet, poll in background
        if (report && report.technicalQuestions?.length > 0 && !report.technicalQuestions[0]?.quickAnswer) {
            pollInterval = setInterval(async () => {
                try {
                    const updated = await getReportById(interviewId)
                    // If we find that the first question now has an answer, the background task likely finished
                    if (updated?.technicalQuestions[0]?.quickAnswer) {
                        clearInterval(pollInterval)
                    }
                } catch (err) {
                    console.error("Background poll error:", err)
                }
            }, 5000)
        }
        return () => clearInterval(pollInterval)
    }, [ report?.technicalQuestions, interviewId ])



    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'


    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'chat' && (
                        <section className="chat-section">
                            <div className='content-header'>
                                <h2>AI Tutor Chat</h2>
                                <p className="subtitle">Request specific questions or refine topics.</p>
                            </div>

                            <div className="chat-container">
                                <div className="chat-messages">
                                    {report.chatHistory?.length === 0 && (
                                        <div className="chat-empty">
                                            <p>Ask for questions on specific topics like "Advanced React" or "Leadership scenarios".</p>
                                        </div>
                                    )}
                                    {report.chatHistory?.map((msg, i) => (
                                        <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
                                            <div className="chat-bubble__content">{msg.content}</div>
                                        </div>
                                    ))}
                                    {chatLoading && <div className="chat-bubble chat-bubble--assistant loading-dots">Thinking...</div>}
                                    <div ref={chatEndRef} />
                                </div>

                                <form className="chat-input-area" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Type your request here..."
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        disabled={chatLoading}
                                    />
                                    <button type="submit" disabled={chatLoading || !chatMessage.trim()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </button>
                                </form>
                            </div>

                            {report.chatQuestions?.length > 0 && (
                                <div className="chat-questions-list">
                                    <h3>Custom Practice Questions</h3>
                                    <div className='q-list'>
                                        {report.chatQuestions.map((q, i) => (
                                            <QuestionCard key={i} item={q} index={i} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview