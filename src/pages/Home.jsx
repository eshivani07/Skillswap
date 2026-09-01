import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import SessionCard from '../components/SessionCard.jsx'
import { mockSessions } from '../data/mockSessions.js'
import { mockAssignments } from '../data/mockAssignments.js'
import { mockSkills } from '../data/mockSkills.js'

export default function Home() {
  const navigate = useNavigate()
  const { profile, wallet } = useApp()
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)

  const upcoming = mockSessions[0]
  const pendingAssignments = mockAssignments.filter((item) => item.status !== 'Completed').length

  const handleJoinSession = (session) => {
    navigate(`/session/${session.id}`, { state: session })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-2xl p-6">
        <p className="text-sm uppercase tracking-wide opacity-80">Welcome back</p>
        <h1 className="text-3xl font-bold mt-1">{profile.name || 'Learner'}!</h1>
        <p className="mt-2 text-brand-50">What do you want to learn today?</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Continue Learning</p>
          <h3 className="mt-2 font-semibold text-lg">C Programming</h3>
          <p className="text-sm text-slate-500">Variables · Data Types</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Upcoming Session</p>
          <h3 className="mt-2 font-semibold text-lg">{upcoming.skill}</h3>
          <p className="text-sm text-slate-500">{upcoming.date} · {upcoming.time}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Assignments</p>
          <h3 className="mt-2 font-semibold text-lg">{pendingAssignments} pending</h3>
          <p className="text-sm text-slate-500">Keep your progress moving</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recommended sessions</h2>
            <button 
              onClick={() => navigate('/discover')}
              className="text-sm text-brand-600 font-medium hover:text-brand-700">View all</button>
          </div>

          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div key={session.id} className="border border-slate-200 rounded-lg p-3 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <p className="font-semibold">{session.topic}</p>
                  <p className="text-sm text-slate-500">{session.host} · {session.type} · {session.level}</p>
                </div>
                <span className="text-sm text-slate-500">{session.participants}/{session.maxParticipants}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-xl font-bold mb-4">SkillCoins</h2>
          <p className="text-4xl font-bold text-brand-600">🪙 {wallet.balance}</p>
          <p className="text-sm text-slate-500 mt-2">Earn by helping others and spend by learning.</p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">Live Now</h2>
        <div className="space-y-3">
          {mockSessions.slice(0, 6).map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onJoin={handleJoinSession}
            />
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">Recently learned topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockSkills.slice(0, 4).map((skill) => (
            <div key={skill.id} className="bg-slate-50 rounded-lg p-4">
              <p className="font-semibold">{skill.name}</p>
              <p className="text-sm text-slate-500 mt-1">{skill.progress}% progress</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
