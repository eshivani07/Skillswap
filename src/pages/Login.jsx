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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--cream), var(--beige))',
        padding: '0 16px',
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 380, padding: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'var(--brown)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 800, fontSize: 24, color: 'var(--black-soft)' }}>SkillSwap</span>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--brown)', fontSize: 14, marginBottom: 22 }}>
          Learn something new by teaching something you know.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--black-soft)', marginBottom: 6 }}>
              Full name
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--black-soft)', marginBottom: 6 }}>
              Year / Branch
            </label>
            <input
              className="input"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2nd Year, CSE"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0' }}>
            Continue
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--brown-light)', marginTop: 16 }}>
          Demo login — no password needed for this prototype.
        </p>
      </div>
    </div>
  )
}