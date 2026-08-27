import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    login(name.trim(), year.trim() || 'Student')
    navigate('/profile')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-mint-500/10 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="font-bold text-2xl">SkillSwap</span>
        </div>
        <p className="text-center text-slate-500 text-sm mb-6">
          Learn something new by teaching something you know.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Year / Branch</label>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2nd Year, CSE"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Continue
          </button>
        </form>
        <p className="text-xs text-center text-slate-400 mt-4">
          Demo login — no password needed for this prototype.
        </p>
      </div>
    </div>
  )
}
