import React from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function Wallet() {
  const { wallet } = useApp()

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, color: 'var(--black-soft)', marginBottom: 4 }}>SkillCoin Wallet</h1>
      <p style={{ color: 'var(--brown)', fontSize: 14, marginBottom: 24 }}>
        Earn coins by teaching, spend them to learn from others.
      </p>

      <div
        style={{
          background: 'linear-gradient(135deg, var(--brown), var(--brown-dark))',
          color: '#fff',
          borderRadius: 'var(--radius)',
          padding: 24,
          marginBottom: 24,
          boxShadow: 'var(--shadow)',
        }}
      >
        <p style={{ fontSize: 13, opacity: 0.8 }}>Current balance</p>
        <p style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>🪙 {wallet.balance}</p>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--black-soft)', marginBottom: 12 }}>
        Transaction history
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {wallet.transactions.map((t) => (
          <div
            key={t.id}
            className="card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
          >
            <div>
              <p style={{ fontWeight: 500, color: 'var(--black-soft)' }}>{t.label}</p>
              <p style={{ fontSize: 12, color: 'var(--brown-light)' }}>{new Date(t.date).toLocaleString()}</p>
            </div>
            <span
              style={{
                fontWeight: 700,
                color: t.amount >= 0 ? 'var(--success)' : 'var(--danger)',
              }}
            >
              {t.amount >= 0 ? '+' : ''}
              {t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}