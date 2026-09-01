import React, { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function Learnt() {
  const { profile } = useApp()
  const [completedSessions, setCompletedSessions] = useState([])
  const [quizResults, setQuizResults] = useState([])
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    // Load completed sessions
    const sessions = JSON.parse(localStorage.getItem('skillswap_completed_sessions') || '[]')
    setCompletedSessions(sessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)))

    // Load quiz results
    const quizzes = JSON.parse(localStorage.getItem('skillswap_quiz_results') || '[]')
    setQuizResults(quizzes)

    // Load assignment submissions
    const subs = JSON.parse(localStorage.getItem('skillswap_assignments_submitted') || '[]')
    setAssignments(subs)
  }, [])

  const groupedBySkill = {}
  completedSessions.forEach((session) => {
    if (!groupedBySkill[session.topic]) {
      groupedBySkill[session.topic] = []
    }
    groupedBySkill[session.topic].push(session)
  })

  const getQuizScoreForSession = (sessionId) => {
    return quizResults.find(q => q.sessionId === sessionId)
  }

  const getAssignmentsForSession = (sessionId) => {
    return assignments.filter(a => a.sessionId === sessionId)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Learning Progress</h1>
        <p className="text-slate-500 mt-1">Track what you have mastered and continue improving.</p>
      </div>

      {completedSessions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-lg">No completed sessions yet.</p>
          <p className="text-slate-400 text-sm mt-2">Join or create a session to start learning!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBySkill).map(([skill, sessions]) => {
            const skillQuizzes = sessions
              .map(s => getQuizScoreForSession(s.sessionId))
              .filter(q => q)
            const avgScore = skillQuizzes.length > 0
              ? Math.round(skillQuizzes.reduce((sum, q) => sum + q.score, 0) / skillQuizzes.length)
              : 0

            return (
              <div key={skill} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">{skill}</h2>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs opacity-80 uppercase font-semibold">Sessions</p>
                      <p className="text-2xl font-bold">{sessions.length}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 uppercase font-semibold">Avg Quiz Score</p>
                      <p className="text-2xl font-bold">{avgScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 uppercase font-semibold">Topics Learned</p>
                      <p className="text-2xl font-bold">{new Set(sessions.flatMap(s => s.topicsCovered)).size}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 uppercase font-semibold">Total Time</p>
                      <p className="text-2xl font-bold">{sessions.reduce((sum, s) => sum + (s.duration || 0), 0)}m</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {sessions.map((session) => {
                    const quiz = getQuizScoreForSession(session.sessionId)
                    const sessionAssignments = getAssignmentsForSession(session.sessionId)
                    const passedCount = sessionAssignments.filter(a => a.passed).length

                    return (
                      <div key={session.sessionId} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{session.topic}</h3>
                            <p className="text-sm text-slate-500">{formatDate(session.completedAt)}</p>
                          </div>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            Completed ✓
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Session Duration</p>
                            <p className="text-lg font-bold text-slate-700">{session.duration} min</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-3">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Progress</p>
                            <p className="text-lg font-bold text-slate-700">{session.coveredCount}/{session.totalSteps} steps</p>
                          </div>
                          {quiz && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs text-blue-600 uppercase font-semibold mb-1">Quiz Score</p>
                              <p className="text-lg font-bold text-blue-700">{quiz.score}/{quiz.totalQuestions} ({quiz.percentage}%)</p>
                            </div>
                          )}
                        </div>

                        {session.topicsCovered.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Topics Covered</p>
                            <div className="flex flex-wrap gap-2">
                              {session.topicsCovered.map((topic, idx) => (
                                <span key={idx} className="bg-brand-100 text-brand-700 px-2 py-1 rounded text-sm">
                                  ✓ {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {sessionAssignments.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Assignments</p>
                            <div className="space-y-1">
                              {sessionAssignments.map((assignment, idx) => (
                                <p key={idx} className="text-sm">
                                  <span className={assignment.passed ? 'text-green-600' : 'text-yellow-600'}>
                                    {assignment.passed ? '✅' : '⏳'}
                                  </span>
                                  {' '}
                                  {assignment.title} ({assignment.score}/10)
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {session.notes && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Session Notes</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{session.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
