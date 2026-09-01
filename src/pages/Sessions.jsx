import React from 'react'
import { useApp } from '../context/AppContext.jsx'

const statusStyles = {
  requested: { background: 'var(--beige)', color: 'var(--warning)' },
  completed: { background: 'var(--beige)', color: 'var(--success)' },
}

export default function Sessions() {
  const { sessions, completeSessionAsTeacher } = useApp()

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, color: 'var(--black-soft)', marginBottom: 4 }}>Your sessions</h1>
      <p style={{ color: 'var(--brown)', fontSize: 14, marginBottom: 24 }}>
        Sessions booked through Discover show up here. Mark a session complete once taught to earn a SkillCoin.
      </p>

      {sessions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--brown-light)' }}>
          No sessions yet — go to <strong>Discover</strong> and request one.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sessions.map((s) => (
          <div
            key={s.id}
            className="card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
          >
            <div>
              <p style={{ fontWeight: 600, color: 'var(--black-soft)' }}>
                {s.skill} with {s.withUser}
              </p>
              <p style={{ fontSize: 13, color: 'var(--brown)' }}>{s.slot}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 999,
                  ...statusStyles[s.status],
                }}
              >
                {s.status}
              </span>
              {s.status === 'requested' && (
                <button
                  onClick={() => completeSessionAsTeacher(s.id)}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  Mark complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}