import React, { useState } from 'react'
import SessionAccessModal from './SessionAccessModal.jsx'

export default function SessionCard({ session, onJoin }) {
  const [showAccessModal, setShowAccessModal] = useState(false)

  const handleJoinClick = () => {
    if (session.visibility === 'private') {
      setShowAccessModal(true)
    } else {
      onJoin(session)
    }
  }

  const handleAccessSuccess = () => {
    setShowAccessModal(false)
    onJoin(session)
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{session.topic}</h3>
            {session.visibility === 'private' ? (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">🔒 Private</span>
            ) : (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Public</span>
            )}
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Live</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600 mb-3">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Level</p>
              <p>{session.level}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Type</p>
              <p>{session.type}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Host</p>
              <p>{session.host}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Participants</p>
              <p>{session.participants} / {session.maxParticipants}</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-slate-700">
              <span className="font-medium">Goal:</span> {session.goal}
            </p>
            {session.currentTopic && (
              <p className="text-sm text-slate-600 mt-1">
                <span className="font-medium">Currently:</span> {session.currentTopic}
              </p>
            )}
          </div>

          <div className="flex gap-2 text-xs text-slate-500">
            <span>⏱️ {session.durationMinutes} min</span>
          </div>
        </div>

        <button
          onClick={handleJoinClick}
          disabled={session.participants >= session.maxParticipants && session.visibility !== 'private'}
          className="ml-4 px-6 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex-shrink-0"
        >
          {session.participants >= session.maxParticipants && session.visibility !== 'private' ? 'Full' : 'Join Now'}
        </button>
      </div>

      {showAccessModal && (
        <SessionAccessModal
          session={session}
          onAccess={handleAccessSuccess}
          onCancel={() => setShowAccessModal(false)}
        />
      )}
    </>
  )
}
