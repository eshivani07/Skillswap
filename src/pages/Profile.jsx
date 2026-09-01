import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

function SkillInput({ label, skills, onAdd, onRemove }) {
  const [value, setValue] = useState('')

  const add = () => {
    if (value.trim() && !skills.includes(value.trim())) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: 18, marginBottom: 14, color: 'var(--black-soft)' }}>{label}</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <input
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="e.g. Python, Guitar, Public Speaking"
        />
        <button onClick={add} className="btn btn-primary">
          Add
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.length === 0 && (
          <span style={{ fontSize: 14, color: 'var(--brown-light)' }}>No skills added yet.</span>
        )}
        {skills.map((s) => (
          <span key={s} className="tag" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {s}
            <button
              onClick={() => onRemove(s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brown-dark)', opacity: 0.6, fontSize: 13 }}
            >
              ×
            </button>
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
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, color: 'var(--black-soft)' }}>{profile.name}'s Skill Profile</h1>
        <p style={{ color: 'var(--brown)', fontSize: 14 }}>{profile.year}</p>
      </div>

      <SkillInput label="Skills I can teach" skills={profile.teaches} onAdd={addTeach} onRemove={removeTeach} />
      <div style={{ height: 20 }} />
      <SkillInput label="Skills I want to learn" skills={profile.learns} onAdd={addLearn} onRemove={removeLearn} />

      <div
        style={{
          marginTop: 24,
          padding: 18,
          borderRadius: 'var(--radius)',
          background: 'var(--beige)',
          border: '1px solid var(--beige-dark)',
          color: 'var(--brown-dark)',
          fontSize: 14,
        }}
      >
        Tip: add at least one skill to each list, then head to <strong>Discover</strong> to see your AI-matched learning partners.
      </div>
    </div>
  )
}