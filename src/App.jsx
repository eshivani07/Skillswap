import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Discover from './pages/Discover.jsx'
import Sessions from './pages/Sessions.jsx'
import Wallet from './pages/Wallet.jsx'

function Protected({ children }) {
  const { isLoggedIn } = useApp()
  return isLoggedIn ? children : <Navigate to="/" replace />
}

export default function App() {
  const { isLoggedIn } = useApp()

  return (
    <div className="min-h-screen">
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/discover" replace /> : <Login />} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/discover" element={<Protected><Discover /></Protected>} />
        <Route path="/sessions" element={<Protected><Sessions /></Protected>} />
        <Route path="/wallet" element={<Protected><Wallet /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
