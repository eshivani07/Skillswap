// src/pages/Assignments.jsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createAssignments, submitAssignment } from '../services/assignmentService.js'

export default function Assignments() {
  const location = useLocation()
  const navigate = useNavigate()
  const { skill, level, weakTopics = [] } = location.state || {}

  const [assignments, setAssignments] = useState(null)
  const [active, setActive] = useState(null)
  const [submission, setSubmission] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!skill) { setError('Missing session info — go back and finish the quiz first.'); setLoading(false); return }
    createAssignments({ skill, level: level || 'Beginner', weakTopics })
      .then(setAssignments)
      .catch(() => setError('Could not generate assignments — check that Ollama is running.'))
      .finally(() => setLoading(false))
  }, [skill])

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-8 text-slate-500">Generating assignments…</div>
  if (error) return <div className="max-w-2xl mx-auto px-4 py-8 text-red-500">{error}</div>

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await submitAssignment({ skill, prompt: active.prompt, submission })
      setFeedback(result)
      
      // Save assignment submission to localStorage
      const assignmentSubmission = {
        sessionId: location.state?.sessionId,
        skill,
        title: active.title,
        prompt: active.prompt,
        topic: active.topic,
        submission,
        passed: result.passed,
        score: result.score,
        feedback: result.feedback,
        submittedAt: new Date().toISOString()
      }
      
      const savedSubmissions = JSON.parse(localStorage.getItem('skillswap_assignments_submitted') || '[]')
      savedSubmissions.push(assignmentSubmission)
      localStorage.setItem('skillswap_assignments_submitted', JSON.stringify(savedSubmissions))
      
    } catch {
      setError('Could not evaluate your submission — check that Ollama is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{skill} — Assignments</h1>

      {!active && (
        <div className="space-y-3">
          {assignments.map((a) => (
            <button
              key={a.id}
              onClick={() => { setActive(a); setFeedback(null); setSubmission('') }}
              className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-400"
            >
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-slate-500">{a.prompt}</p>
            </button>
          ))}
          <button onClick={() => navigate('/discover')} className="text-sm text-slate-500 underline mt-4">
            Finish for now
          </button>
        </div>
      )}

      {active && !feedback && (
        <div>
          <p className="font-medium mb-2">{active.prompt}</p>
          <textarea
            className="w-full border border-slate-200 rounded-lg p-3 text-sm font-mono"
            rows={8}
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Write your solution here..."
          />
          <div className="flex gap-2 mt-3">
            <button onClick={handleSubmit} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium">
              Submit for AI review
            </button>
            <button onClick={() => setActive(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
              Back
            </button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="font-semibold mb-1">{feedback.passed ? '✅ Passed' : '🔁 Needs work'} — {feedback.score}/10</p>
          <p className="text-sm text-slate-600">{feedback.feedback}</p>
          <button onClick={() => setActive(null)} className="mt-4 text-sm underline text-slate-500">
            Back to assignments
          </button>
        </div>
      )}
    </div>
  )
}
