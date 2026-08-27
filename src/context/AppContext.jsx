import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'skillswap_state_v1'

const defaultState = {
  isLoggedIn: false,
  profile: {
    name: '',
    year: '',
    teaches: [],
    learns: []
  },
  wallet: {
    balance: 5, // starter bonus coins
    transactions: [
      { id: 't0', type: 'bonus', label: 'Welcome bonus', amount: 5, date: new Date().toISOString() }
    ]
  },
  sessions: []
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultState
  } catch {
    return defaultState
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = (name, year) => {
    setState((s) => ({
      ...s,
      isLoggedIn: true,
      profile: { ...s.profile, name, year }
    }))
  }

  const logout = () => setState((s) => ({ ...s, isLoggedIn: false }))

  const updateProfile = (partial) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...partial } }))
  }

  const addTransaction = (type, label, amount) => {
    setState((s) => ({
      ...s,
      wallet: {
        balance: s.wallet.balance + amount,
        transactions: [
          { id: 't' + Date.now(), type, label, amount, date: new Date().toISOString() },
          ...s.wallet.transactions
        ]
      }
    }))
  }

  const bookSession = (withUser, skill, slot) => {
    const session = {
      id: 's' + Date.now(),
      withUser: withUser.name,
      skill,
      slot,
      status: 'requested'
    }
    setState((s) => ({ ...s, sessions: [session, ...s.sessions] }))
    return session
  }

  const completeSessionAsTeacher = (sessionId) => {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, status: 'completed' } : sess
      )
    }))
    addTransaction('earn', 'Taught a session', 1)
  }

  const value = {
    ...state,
    login,
    logout,
    updateProfile,
    addTransaction,
    bookSession,
    completeSessionAsTeacher
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
