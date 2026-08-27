import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

function SkillInput({ label, color, skills, onAdd, onRemove }) {
  const [value, setValue] = useState('')

  const add = () => {
    if (value.trim() && !skills.includes(value.trim())) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold mb-3">{label}</h3>
      <div className="flex gap-2 mb-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="e.g. Python, Guitar, Public Speaking"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && (
          <span className="text-sm text-slate-400">No skills added yet.</span>
        )}
        {skills.map((s) => (
          <span
            key={s}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}
          >
            {s}
            <button onClick={() => onRemove(s)} className="opacity-60 hover:opacity-100">×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Profile() {
  const { profile, updateProfile } = useApp()

  const addTeach = (s) => updateProfile({ teaches: [...profile.teaches, s] })
  const removeTeach = (s) => updateProfile({ teaches: profile.teaches.filter((x) => x !== s) })
  const addLearn = (s) => updateProfile({ learns: [...profile.learns, s] })
  const removeLearn = (s) => updateProfile({ learns: profile.learns.filter((x) => x !== s) })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{profile.name}'s Skill Profile</h1>
        <p className="text-slate-500 text-sm">{profile.year}</p>
      </div>

      <SkillInput
        label="Skills I can teach"
        color="bg-mint-500/10 text-mint-600"
        skills={profile.teaches}
        onAdd={addTeach}
        onRemove={removeTeach}
      />
      <SkillInput
        label="Skills I want to learn"
        color="bg-brand-500/10 text-brand-700"
        skills={profile.learns}
        onAdd={addLearn}
        onRemove={removeLearn}
      />

      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
        Tip: add at least one skill to each list, then head to <strong>Discover</strong> to see your AI-matched learning partners.
      </div>
    </div>
  )
}
