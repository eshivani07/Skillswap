// src/pages/Dashboard.jsx
// The landing page after login. Shows every currently-live session in real
// time, a search bar to filter by skill, and a + button to go live yourself.
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SessionCard from '../components/SessionCard.jsx'
import { mockSessions } from '../data/mockSessions.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return mockSessions
    return mockSessions.filter((s) => {
      const topicMatch = (s.topic || s.skill || '').toLowerCase().includes(search.toLowerCase())
      const skillMatch = (s.skill || '').toLowerCase().includes(search.toLowerCase())
      return topicMatch || skillMatch
    })
  }, [search])

  const handleJoinSession = (session) => {
    navigate(`/session/${session.id}`, { state: session })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Live Sessions</h1>
        <button
          onClick={() => navigate('/create-session')}
          className="w-10 h-10 rounded-full bg-brand-500 text-white text-2xl leading-none flex items-center justify-center hover:bg-brand-600 transition"
          title="Create a new session"
        >
          +
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search live sessions by skill..."
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      <p className="text-sm text-slate-500 mb-3">Live sessions ({filtered.length})</p>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No live sessions right now — start one with the + button.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onJoin={handleJoinSession}
          />
        ))}
      </div>
    </div>
  )
}
