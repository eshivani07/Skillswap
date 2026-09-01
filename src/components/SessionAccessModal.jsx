import React, { useState } from 'react'

export default function SessionAccessModal({ session, onAccess, onCancel }) {
  const [enteredKey, setEnteredKey] = useState('')
  const [error, setError] = useState('')

  const handleJoin = () => {
    setError('')

    if (!enteredKey.trim()) {
      setError('Please enter a session key')
      return
    }

    if (enteredKey.trim() === session.sessionKey) {
      onAccess()
    } else {
      setError('Invalid session key. Please try again.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2">Private Session</h2>
        <p className="text-sm text-slate-600 mb-4">
          This session requires an access key to join.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Session Key
            </label>
            <input
              type="text"
              value={enteredKey}
              onChange={(e) => {
                setEnteredKey(e.target.value.toUpperCase())
                setError('')
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., SKL-8F42Q"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleJoin}
              className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition"
            >
              Join Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
