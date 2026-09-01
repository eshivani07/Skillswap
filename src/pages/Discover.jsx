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
    <div className="page">
      <h1 style={{ fontSize: 26, color: 'var(--black-soft)', marginBottom: 4 }}>Discover matches</h1>
      <p style={{ color: 'var(--brown)', fontSize: 14, marginBottom: 24 }}>
        Ranked by skill overlap with your profile — a simple stand-in for the AI Matchmaking Model.
      </p>

      {profile.teaches.length === 0 && profile.learns.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--brown-light)' }}>
          Add some skills on your <strong>Profile</strong> page first to see matches.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {matches.map(({ user, score, matchedSkills, mutual }) => (
          <div key={user.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--black-soft)' }}>{user.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--brown)' }}>
                  {user.year} · ⭐ {user.rating} · {user.sessionsTaught} sessions taught
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--brown-light)' }}>Match score</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brown-dark)' }}>{score}</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {user.teaches.map((s) => {
                const isMatched = matchedSkills.includes(s.toLowerCase())
                return (
                  <span
                    key={s}
                    className={isMatched ? undefined : 'tag'}
                    style={
                      isMatched
                        ? {
                            padding: '4px 12px',
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 600,
                            background: 'var(--brown)',
                            color: '#fff',
                          }
                        : undefined
                    }
                  >
                    {s}
                  </span>
                )
              })}
            </div>

            {mutual && (
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', marginTop: 8 }}>
                ↔ Mutual swap possible — they want a skill you teach too
              </p>
            )}

            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {user.teaches
                .filter((s) => profile.learns.map((l) => l.toLowerCase()).includes(s.toLowerCase()))
                .map((skill) => (
                  <button key={skill} onClick={() => handleBook(user, skill)} className="btn btn-primary">
                    Request "{skill}" session
                  </button>
                ))}
            </div>

            {bookedFor === user.id && (
              <p style={{ fontSize: 13, color: 'var(--success)', marginTop: 8 }}>
                ✓ Session requested! Check the Sessions tab.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}