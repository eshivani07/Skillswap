import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { createLiveSession } from '../services/liveSessionService.js'

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Generate a unique session key for private sessions
 * Format: SKL-8F42Q
 */
function generateSessionKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = 'SKL-'
  for (let i = 0; i < 5; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

export default function CreateSession() {
  const navigate = useNavigate()
  const { profile, uid } = useApp()

  const [form, setForm] = useState({
    skill: '',
    level: 'Beginner',
    sessionType: 'Video',
    maxParticipants: 2,
    duration: 30,
    date: today(),
    time: '09:00',
    learningGoal: '',
    visibility: 'public',
    sessionKey: null
  })

  const [sessionCreated, setSessionCreated] = useState(null)

  const updateForm = (field, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }
      
      // Generate session key when visibility changes to private
      if (field === 'visibility' && value === 'private' && !prev.sessionKey) {
        newForm.sessionKey = generateSessionKey()
      } else if (field === 'visibility' && value === 'public') {
        newForm.sessionKey = null
      }
      
      return newForm
    })
  }

  const handleCreate = async () => {
    if (!form.skill.trim()) return

    const sessionKey = form.visibility === 'private' ? form.sessionKey : null

    const localSession = {
      id: `local-${Date.now()}`,
      hostId: uid || 'local-user',
      host: profile.name || 'Anonymous',
      topic: form.skill.trim(),
      skill: form.skill.trim(),
      level: form.level,
      type: form.sessionType,
      maxParticipants: form.maxParticipants,
      durationMinutes: form.duration,
      currentTopic: form.skill.trim(),
      goal: form.learningGoal || 'Practice key concepts and reinforce understanding.',
      learningGoal: form.learningGoal || 'Practice key concepts and reinforce understanding.',
      participants: 1,
      visibility: form.visibility,
      sessionKey: sessionKey,
      isLive: true,
      startedAt: new Date(),
      participantIds: [uid || 'local-user']
    }

    try {
      if (uid) {
        const sessionId = await createLiveSession({
          hostId: uid,
          hostName: profile.name || 'Anonymous',
          skill: form.skill.trim(),
          level: form.level,
          sessionType: form.sessionType,
          maxParticipants: form.maxParticipants,
          durationMinutes: form.duration,
          date: form.date,
          time: form.time,
          learningGoal: form.learningGoal || 'Practice key concepts and reinforce understanding.',
          visibility: form.visibility,
          sessionKey: sessionKey
        })

        localSession.id = sessionId
      }
    } catch (err) {
      console.error('Live session creation failed, using local session fallback', err)
    }

    // Show the session created modal for private sessions
    if (form.visibility === 'private') {
      setSessionCreated(localSession)
    } else {
      navigate(`/session/${localSession.id}`, { state: localSession })
    }
  }

  const handleGoLive = () => {
    navigate(`/session/${sessionCreated.id}`, { state: sessionCreated })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {sessionCreated && form.visibility === 'private' ? (
        // Private Session Created Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Private Session Created!</h2>
            <p className="text-slate-600 mb-6">
              Your session is ready. Share this key only with people you want to invite.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-blue-600 uppercase font-semibold mb-2">Session Key</p>
              <p className="text-3xl font-mono font-bold text-blue-700">{sessionCreated.sessionKey}</p>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Topic: <span className="font-semibold">{sessionCreated.topic}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const text = `Join my SkillSwap session!\nTopic: ${sessionCreated.topic}\nSession Key: ${sessionCreated.sessionKey}`
                  navigator.clipboard.writeText(text)
                  alert('Copied to clipboard!')
                }}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
              >
                Copy Key
              </button>
              <button
                onClick={handleGoLive}
                className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition"
              >
                Go Live
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">New Session</p>
              <h1 className="text-3xl font-bold">Create Session</h1>
            </div>
            <button
              onClick={() => navigate('/discover')}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Skill / Topic</span>
                <input
                  value={form.skill}
                  onChange={(e) => updateForm('skill', e.target.value)}
                  placeholder="e.g. Python, Public Speaking"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Level</span>
                <select
                  value={form.level}
                  onChange={(e) => updateForm('level', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Session Type</span>
                <select
                  value={form.sessionType}
                  onChange={(e) => updateForm('sessionType', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                >
                  <option>Video</option>
                  <option>Audio</option>
                  <option>Chat</option>
                </select>
              </label>

              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Number of People</span>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={form.maxParticipants}
                  onChange={(e) => updateForm('maxParticipants', Number(e.target.value) || 2)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Duration</span>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={form.duration}
                  onChange={(e) => updateForm('duration', Number(e.target.value) || 30)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </label>

              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="block text-slate-600 mb-1">Time</span>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateForm('time', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </label>

              <label className="text-sm md:col-span-2">
                <span className="block text-slate-600 mb-1">Learning Goal</span>
                <textarea
                  rows={4}
                  value={form.learningGoal}
                  onChange={(e) => updateForm('learningGoal', e.target.value)}
                  placeholder="What should this session focus on?"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </label>

              <fieldset className="md:col-span-2">
                <legend className="block text-slate-600 mb-3 text-sm font-medium">Session Visibility</legend>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={form.visibility === 'public'}
                      onChange={(e) => updateForm('visibility', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">
                      <span className="font-medium">Public</span>
                      <span className="text-slate-500 ml-1">— Anyone can join</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={form.visibility === 'private'}
                      onChange={(e) => updateForm('visibility', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">
                      <span className="font-medium">Private 🔒</span>
                      <span className="text-slate-500 ml-1">— Requires session key</span>
                    </span>
                  </label>
                </div>
                {form.visibility === 'private' && form.sessionKey && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Generated Key</p>
                    <p className="font-mono text-sm font-bold text-blue-700">{form.sessionKey}</p>
                  </div>
                )}
              </fieldset>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCreate}
                className="px-5 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600"
              >
                Go Live
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
