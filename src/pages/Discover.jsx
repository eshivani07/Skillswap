import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { mockUsers } from '../data/mockUsers.js'
import { rankMatches } from '../utils/matching.js'

export default function Discover() {
  const { profile, bookSession } = useApp()
  const [bookedFor, setBookedFor] = useState(null)

  const matches = useMemo(() => rankMatches(profile, mockUsers), [profile])

  const handleBook = (user, skill) => {
    bookSession(user, skill, 'Tomorrow, 6:00 PM')
    setBookedFor(user.id)
    setTimeout(() => setBookedFor(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Discover matches</h1>
      <p className="text-slate-500 text-sm mb-6">
        Ranked by skill overlap with your profile — a simple stand-in for the AI Matchmaking Model.
      </p>

      {profile.teaches.length === 0 && profile.learns.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          Add some skills on your <strong>Profile</strong> page first to see matches.
        </div>
      )}

      <div className="space-y-4">
        {matches.map(({ user, score, matchedSkills, mutual }) => (
          <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.year} · ⭐ {user.rating} · {user.sessionsTaught} sessions taught</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Match score</div>
                <div className="text-xl font-bold text-brand-600">{score}</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {user.teaches.map((s) => (
                <span
                  key={s}
                  className={`px-2.5 py-1 rounded-full ${
                    matchedSkills.includes(s.toLowerCase())
                      ? 'bg-mint-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>

            {mutual && (
              <p className="text-xs text-mint-600 font-medium mt-2">↔ Mutual swap possible — they want a skill you teach too</p>
            )}

            <div className="mt-4 flex gap-2">
              {user.teaches
                .filter((s) => profile.learns.map((l) => l.toLowerCase()).includes(s.toLowerCase()))
                .map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleBook(user, skill)}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg"
                  >
                    Request "{skill}" session
                  </button>
                ))}
            </div>

            {bookedFor === user.id && (
              <p className="text-sm text-mint-600 mt-2">✓ Session requested! Check the Sessions tab.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
