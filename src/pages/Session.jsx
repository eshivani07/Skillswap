// src/pages/Session.jsx
// The live learning room. Everyone who joined this session shares the SAME
// chat in real time (via Firestore), and the AI Buddy participates alongside
// them — whoever sends a message also fetches and posts the AI's reply, so
// it only appears once no matter how many people are in the room.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import ParticipantArea from '../components/ParticipantArea.jsx'
import { askTutor } from '../services/aiService.js'
import {
  endLiveSession, getLiveSession, joinLiveSession,
  sendMessage, subscribeToMessages
} from '../services/liveSessionService.js'

const defaultSubtopics = [
  'Warm-up discussion',
  'Core concept',
  'Worked example',
  'Practice task',
  'Review and recap'
]

export default function Session() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, uid } = useApp()

  const [session, setSession] = useState(location.state || null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [notes, setNotes] = useState('')
  const [progress, setProgress] = useState([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [quizPromptShown, setQuizPromptShown] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (location.state) {
      setSession(location.state)
      // Initialize progress from session data or use defaults
      if (location.state.progress) {
        setProgress(location.state.progress)
      } else {
        setProgress(defaultSubtopics.map((title, idx) => ({ id: idx + 1, title, done: idx === 0 })))
      }
      return
    }

    getLiveSession(sessionId).then((sess) => {
      setSession(sess)
      if (sess?.progress) {
        setProgress(sess.progress)
      } else {
        setProgress(defaultSubtopics.map((title, idx) => ({ id: idx + 1, title, done: idx === 0 })))
      }
    })
  }, [location.state, sessionId])

  useEffect(() => {
    if (!uid) return
    joinLiveSession(sessionId, uid)
  }, [sessionId, uid])

  useEffect(() => {
    const unsub = subscribeToMessages(sessionId, setMessages)
    return unsub
  }, [sessionId])

  useEffect(() => {
    if (!session) return
    
    // Use startTime and endTime for accurate timer
    let startTime = session.startTime
    let endTime = session.endTime
    
    // If startTime/endTime are not available, calculate from startedAt/durationMinutes
    if (!startTime || !endTime) {
      startTime = session.startedAt instanceof Date ? session.startedAt : new Date(session.startedAt?.seconds ? session.startedAt.seconds * 1000 : Date.now())
      const durationMs = Number(session.durationMinutes || 30) * 60 * 1000
      endTime = new Date(startTime.getTime() + durationMs)
    }

    const updateTime = () => {
      const now = Date.now()
      const remaining = Math.max(0, new Date(endTime).getTime() - now)
      setTimeLeft(remaining)
      
      // Auto-trigger quiz when time runs out
      if (remaining === 0 && !sessionEnded) {
        setSessionEnded(true)
        // Show message about session ending
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [session, sessionEnded])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sessionDurationLabel = useMemo(() => {
    const total = Number(session?.durationMinutes || 30)
    const mins = Math.floor(total)
    return `${mins} min`
  }, [session])

  if (!session) {
    return <div className="max-w-2xl mx-auto px-4 py-8 text-slate-500">Loading session…</div>
  }

  const send = async () => {
    if (!input.trim() || sending || !uid) return
    const question = input.trim()
    setInput('')
    setSending(true)
    try {
      await sendMessage(sessionId, {
        role: 'user',
        senderId: uid,
        senderName: profile.name || 'Anonymous',
        content: question
      })
      const history = messages.slice(-6).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
      const reply = await askTutor({
        skill: session.skill,
        level: session.level || 'Beginner',
        question,
        history
      })
      await sendMessage(sessionId, {
        role: 'assistant',
        senderId: 'ai-buddy',
        senderName: 'AI Buddy',
        content: reply
      })
    } catch {
      await sendMessage(sessionId, {
        role: 'assistant',
        senderId: 'ai-buddy',
        senderName: 'AI Buddy',
        content: "I couldn't reach the AI just now — check that Ollama is running."
      })
    } finally {
      setSending(false)
    }
  }

  const endSession = async () => {
    // Save session data to localStorage
    const completedSession = {
      sessionId: sessionId,
      topic: session.skill || session.topic,
      level: session.level,
      duration: session.durationMinutes || 30,
      goal: session.learningGoal,
      progress: progress,
      notes: notes,
      topicsCovered: progress.filter(p => p.done).map(p => p.title),
      coveredCount: progress.filter(p => p.done).length,
      totalSteps: progress.length,
      completedAt: new Date().toISOString(),
      host: session.hostName || session.host
    }
    
    // Save to localStorage
    const completedSessions = JSON.parse(localStorage.getItem('skillswap_completed_sessions') || '[]')
    completedSessions.push(completedSession)
    localStorage.setItem('skillswap_completed_sessions', JSON.stringify(completedSessions))
    
    try {
      await endLiveSession(sessionId)
    } catch (err) {
      console.error('Failed to end session in Firestore', err)
    }
    
    navigate(`/session/${sessionId}/quiz`, { 
      state: { 
        skill: session.skill || session.topic, 
        level: session.level,
        sessionId: sessionId,
        progress: progress
      } 
    })
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  const toggleProgress = (id) => {
    setProgress((prev) => {
      const updated = prev.map((item) => item.id === id ? { ...item, done: !item.done } : item)
      // Auto-save progress
      const sessionProgressKey = `skillswap_session_${sessionId}_progress`
      localStorage.setItem(sessionProgressKey, JSON.stringify(updated))
      return updated
    })
  }

  // Auto-save notes periodically
  useEffect(() => {
    if (!sessionId) return
    const sessionNotesKey = `skillswap_session_${sessionId}_notes`
    const timer = setTimeout(() => {
      if (notes.trim()) {
        localStorage.setItem(sessionNotesKey, notes)
      }
    }, 2000) // Save after 2 seconds of inactivity
    
    return () => clearTimeout(timer)
  }, [notes, sessionId])

  // Load saved notes and progress on mount
  useEffect(() => {
    if (!sessionId) return
    
    const sessionNotesKey = `skillswap_session_${sessionId}_notes`
    const sessionProgressKey = `skillswap_session_${sessionId}_progress`
    
    const savedNotes = localStorage.getItem(sessionNotesKey)
    if (savedNotes) {
      setNotes(savedNotes)
    }
    
    const savedProgress = localStorage.getItem(sessionProgressKey)
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (err) {
        console.error('Failed to load saved progress:', err)
      }
    }
  }, [sessionId])

  // Trigger quiz prompt when ~10 minutes remain
  useEffect(() => {
    if (quizPromptShown || !session) return
    
    const TEN_MINUTES_MS = 10 * 60 * 1000
    
    if (timeLeft > 0 && timeLeft <= TEN_MINUTES_MS && timeLeft > TEN_MINUTES_MS - 1000) {
      setQuizPromptShown(true)
      // Add AI Buddy message about quiz
      if (!messages.some(m => m.content.includes('quiz'))) {
        try {
          sendMessage(sessionId, {
            role: 'assistant',
            senderId: 'ai-buddy',
            senderName: 'AI Buddy',
            content: `We have about ${Math.ceil(timeLeft / 60000)} minutes left. Shall we take a quick quiz to check what you've learned?`
          }).catch(err => console.error('Failed to send quiz prompt message:', err))
        } catch (err) {
          console.error('Error sending AI message:', err)
        }
      }
    }
  }, [timeLeft, quizPromptShown, session, messages, sessionId])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{session.skill}</h1>
          <p className="text-slate-500 text-sm">
            {session.level} · {session.sessionType || 'Chat'} · {session.date || 'Today'} at {session.time || '09:00'}
          </p>
        </div>
        <button onClick={endSession} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
          End Session
        </button>
      </div>

      {/* Participant Area for Video/Audio sessions */}
      {(session.sessionType === 'Video' || session.sessionType === 'Audio') && (
        <ParticipantArea 
          session={session} 
          sessionType={session.sessionType}
          currentUserName={profile.name || 'You'}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-6">
        <aside className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Participants</h2>
            <div className="space-y-2 text-sm text-slate-600">
              {[session.hostName, ...(session.participantIds || []).filter((id) => id !== session.hostId).map((id) => id.slice(0, 8))].map((person, idx) => (
                <div key={`${person}-${idx}`} className="flex items-center justify-between">
                  <span>{person}</span>
                  <span className="w-2 h-2 rounded-full bg-mint-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Session type</h2>
            <p className="text-brand-600 font-medium">{session.sessionType || 'Chat'}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Session Timer</h2>
            <p className="text-2xl font-bold text-brand-600">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-xs text-slate-500 mt-2">Total duration: {sessionDurationLabel}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Progress</h2>
            <div className="space-y-2">
              {progress.map((step) => (
                <label key={step.id} className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={step.done} onChange={() => toggleProgress(step.id)} />
                  <span className={step.done ? 'line-through text-slate-400' : ''}>{step.title}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="font-semibold mb-2">Topic Panel</h2>
            <p className="font-medium text-lg">{session.topic || session.skill}</p>
            <p className="text-sm text-slate-500 mt-1">Learning goal: {session.learningGoal || 'Practice the key concept and reinforce understanding.'}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl h-[420px] flex flex-col overflow-hidden">
            <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold">AI Buddy</h2>
              <span className="text-xs bg-mint-100 text-mint-700 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-slate-400">No messages yet — say hi or ask the AI Buddy something.</p>
              )}
              {messages.map((m) => {
                const isMe = m.senderId === uid
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      isMe ? 'bg-brand-500 text-white' : m.senderId === 'ai-buddy' ? 'bg-slate-100 text-slate-700' : 'bg-slate-50 border border-slate-200 text-slate-700'
                    }`}>
                      {!isMe && <p className="text-xs font-semibold mb-0.5 opacity-60">{m.senderName}</p>}
                      {m.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-slate-200 p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask the AI Buddy or chat with the room..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
              <button onClick={send} disabled={sending} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                Send
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h2 className="font-semibold mb-2">Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Save important points from the session..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm"
              />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h2 className="font-semibold">Session Controls</h2>
              <div className="space-y-2">
                {quizPromptShown && (
                  <button 
                    onClick={() => navigate(`/session/${sessionId}/quiz`, { state: { skill: session.skill || session.topic, level: session.level, sessionId: sessionId, progress: progress } })} 
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    📝 Start Quiz Now
                  </button>
                )}
                <button 
                  onClick={() => navigate(`/session/${sessionId}/quiz`, { state: { skill: session.skill || session.topic, level: session.level, sessionId: sessionId, progress: progress } })} 
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  Quiz
                </button>
                <button 
                  onClick={() => navigate(`/session/${sessionId}/assignments`, { state: { skill: session.skill || session.topic, level: session.level, weakTopics: ['Concept review'], sessionId: sessionId } })} 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Assignment
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
