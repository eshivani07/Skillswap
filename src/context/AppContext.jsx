import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase.js'

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
    balance: 5,
    transactions: [
      { id: 't0', type: 'bonus', label: 'Welcome bonus', amount: 5, date: new Date().toISOString() }
    ]
  },
  sessions: []
}

function normalizeState(value = {}) {
  return {
    isLoggedIn: !!value.isLoggedIn,
    profile: {
      name: value.profile?.name || '',
      year: value.profile?.year || '',
      teaches: Array.isArray(value.profile?.teaches) ? value.profile.teaches : [],
      learns: Array.isArray(value.profile?.learns) ? value.profile.learns : []
    },
    wallet: {
      balance: Number(value.wallet?.balance ?? 5),
      transactions: Array.isArray(value.wallet?.transactions) ? value.wallet.transactions : [
        {
          id: 't0',
          type: 'bonus',
          label: 'Welcome bonus',
          amount: 5,
          date: new Date().toISOString()
        }
      ]
    },
    sessions: Array.isArray(value.sessions) ? value.sessions : []
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalizeState(JSON.parse(raw)) : defaultState
  } catch {
    return defaultState
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [uid, setUid] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)

        try {
          const snap = await getDoc(doc(db, 'users', user.uid))
          if (snap.exists()) {
            const saved = snap.data()
            setState((prev) => ({
              ...normalizeState(prev),
              ...normalizeState(saved),
              isLoggedIn: saved.isLoggedIn ?? true
            }))
          }
        } catch (err) {
          console.error('Failed to load user state from Firestore', err)
        }
      } else {
        signInAnonymously(auth).catch((err) => console.error('Anonymous sign-in failed', err))
      }
    })

    return unsub
  }, [])

  useEffect(() => {
    if (!uid) return

    const userRef = doc(db, 'users', uid)
    setDoc(userRef, {
      uid,
      isLoggedIn: state.isLoggedIn,
      profile: state.profile,
      wallet: state.wallet,
      sessions: state.sessions,
      updatedAt: serverTimestamp()
    }, { merge: true }).catch((err) => console.error('Failed to sync state with Firestore', err))
  }, [uid, state])

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

  const bookSession = (withUser, skill, slot, level = 'Beginner') => {
    const session = {
      id: 's' + Date.now(),
      withUser: withUser.name,
      skill,
      slot,
      level,
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
    uid,
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
