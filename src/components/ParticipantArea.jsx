import React from 'react'

// Mock profile images/colors
const COLORS = [
  'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400',
  'bg-yellow-400', 'bg-pink-400', 'bg-indigo-400', 'bg-cyan-400'
]

const AVATARS = {
  'You': '👤',
  'Arjun': '👨',
  'Priya': '👩',
  'Sneha': '👩',
  'Rohan': '👨',
  'Vikram': '👨',
  'Maya': '👩'
}

export default function ParticipantArea({ session, sessionType, currentUserName = 'You' }) {
  if (!session) return null

  const participants = [
    { name: currentUserName, isYou: true },
    ...(session.participantIds || [])
      .filter(id => id !== session.hostId)
      .map((id, idx) => ({ 
        name: id.slice(0, 8), 
        isYou: false 
      }))
  ]

  if (sessionType === 'Chat') {
    return null // Chat sessions don't show video area
  }

  if (sessionType === 'Audio') {
    // Audio session: show participant list only
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
        <h2 className="font-semibold mb-3">Participants ({participants.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {participants.map((participant, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full ${COLORS[idx % COLORS.length]} flex items-center justify-center text-white font-semibold text-xl`}>
                {AVATARS[participant.name] || participant.name[0]?.toUpperCase()}
              </div>
              <p className="text-sm text-center text-slate-600">{participant.name}</p>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (sessionType === 'Video') {
    // Video session: show mock video grid
    return (
      <div className="bg-black rounded-xl p-4 mb-4 min-h-[300px]">
        <h2 className="font-semibold mb-3 text-white">Video Room ({participants.length})</h2>
        <div className="grid grid-cols-2 gap-2 h-[250px]">
          {participants.slice(0, 4).map((participant, idx) => (
            <div
              key={idx}
              className={`${COLORS[idx % COLORS.length]} rounded-lg flex flex-col items-center justify-center relative overflow-hidden`}
            >
              <div className="text-5xl opacity-70">{AVATARS[participant.name] || participant.name[0]?.toUpperCase()}</div>
              <p className="text-white font-semibold mt-2 text-sm">{participant.name}</p>
              <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-400" title="Online" />
              {participant.isYou && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">You</span>
              )}
            </div>
          ))}
        </div>
        
        {participants.length > 4 && (
          <p className="text-slate-400 text-sm mt-3">
            +{participants.length - 4} more participant{participants.length - 4 !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    )
  }

  return null
}
