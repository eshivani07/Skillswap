// src/components/Quiz.jsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getLiveSession } from '../services/liveSessionService.js'
import { startQuiz, submitQuiz } from '../services/quizService.js'

export default function Quiz() {
  const { sessionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [session, setSession] = useState(location.state || null)
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session) return
    getLiveSession(sessionId).then(setSession)
  }, [sessionId, session])

  useEffect(() => {
    if (!session) return
    startQuiz({ skill: session.skill, level: session.level || 'Beginner' })
      .then(setQuestions)
      .catch(() => setError('Could not generate a quiz — check that Ollama is running.'))
      .finally(() => setLoading(false))
  }, [session])

  if (!session) return <div className="max-w-2xl mx-auto px-4 py-8 text-slate-500">Loading…</div>
  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-slate-500">Generating your quiz…</div>
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8 text-red-500">{error}</div>

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const graded = await submitQuiz({ skill: session.skill, questions, answers })
      setResult(graded)
      
      // Save quiz result to localStorage
      const quizResult = {
        sessionId: session.id,
        skill: session.skill,
        level: session.level,
        score: graded.score,
        totalQuestions: questions.length,
        percentage: Math.round((graded.score / questions.length) * 100),
        weakTopics: graded.weakTopics || [],
        completedAt: new Date().toISOString(),
        results: graded.results
      }
      
      const savedQuizzes = JSON.parse(localStorage.getItem('skillswap_quiz_results') || '[]')
      savedQuizzes.push(quizResult)
      localStorage.setItem('skillswap_quiz_results', JSON.stringify(savedQuizzes))
      
    } catch {
      setError('Could not grade the quiz — check that Ollama is running.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Score: {result.score}/{questions.length}</h1>
        <div className="space-y-2 mb-6">
          {result.results.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-lg p-3 text-sm">
              <span className="font-medium capitalize">{r.verdict}</span> — {r.feedback}
            </div>
          ))}
        </div>
        {result.weakTopics?.length > 0 && (
          <p className="text-sm text-slate-500 mb-6">Needs improvement: {result.weakTopics.join(', ')}</p>
        )}
        <button
          onClick={() => navigate(`/session/${sessionId}/assignments`, { state: { skill: session.skill, level: session.level, weakTopics: result.weakTopics || [] } })}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium"
        >
          Get practice assignments
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{session.skill} — Quiz</h1>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id}>
            <p className="font-medium mb-1">{i + 1}. {q.question}</p>
            <textarea
              className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              rows={2}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
        Submit quiz
      </button>
    </div>
  )
}
