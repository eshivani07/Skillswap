import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function Navbar() {
  const { profile, wallet, logout } = useApp()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-semibold text-lg">SkillSwap</span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/discover" className={linkClass}>Discover</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          <NavLink to="/sessions" className={linkClass}>Sessions</NavLink>
          <NavLink to="/wallet" className={linkClass}>Wallet</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-mint-500/10 text-mint-600 px-3 py-1.5 rounded-full text-sm font-semibold">
            🪙 {wallet.balance}
          </div>
          <span className="text-sm text-slate-500 hidden sm:inline">{profile.name}</span>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
