import React from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function Wallet() {
  const { wallet } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">SkillCoin Wallet</h1>
      <p className="text-slate-500 text-sm mb-6">Earn coins by teaching, spend them to learn from others.</p>

      <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-2xl p-6 mb-6">
        <p className="text-sm opacity-80">Current balance</p>
        <p className="text-4xl font-bold mt-1">🪙 {wallet.balance}</p>
      </div>

      <h2 className="font-semibold mb-3">Transaction history</h2>
      <div className="space-y-2">
        {wallet.transactions.map((t) => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{t.label}</p>
              <p className="text-xs text-slate-400">{new Date(t.date).toLocaleString()}</p>
            </div>
            <span className={`font-semibold ${t.amount >= 0 ? 'text-mint-600' : 'text-red-500'}`}>
              {t.amount >= 0 ? '+' : ''}{t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
