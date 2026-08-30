import React from 'react'
import { useApp } from '../context/AppContext.jsx'

const statusStyles = {
  requested: 'bg-amber-100 text-amber-700',
  completed: 'bg-mint-500/10 text-mint-600'
}

export default function Sessions() {
  const { sessions, completeSessionAsTeacher } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Your sessions</h1>
      <p className="text-slate-500 text-sm mb-6">
        Sessions booked through Discover show up here. Mark a session complete once taught to earn a SkillCoin.
      </p>

      {sessions.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500">
          No sessions yet — go to <strong>Discover</strong> and request one.
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{s.skill} with {s.withUser}</p>
              <p className="text-sm text-slate-500">{s.slot}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[s.status]}`}>
                {s.status}
              </span>
              {s.status === 'requested' && (
                <button
                  onClick={() => completeSessionAsTeacher(s.id)}
                  className="text-sm px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700"
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
