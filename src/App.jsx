import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Navbar from './components/Navbar.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateSession from './pages/CreateSession.jsx'
import Learnt from './pages/Learnt.jsx'
import Session from './pages/Session.jsx'
import Quiz from './components/Quiz.jsx'
import Assignments from './pages/Assignments.jsx'
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
        <Route path="/home" element={<Protected><Home /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/discover" element={<Protected><Dashboard /></Protected>} />
        <Route path="/create-session" element={<Protected><CreateSession /></Protected>} />
        <Route path="/learnt" element={<Protected><Learnt /></Protected>} />
        <Route path="/session/:sessionId" element={<Protected><Session /></Protected>} />
        <Route path="/session/:sessionId/quiz" element={<Protected><Quiz /></Protected>} />
        <Route path="/session/:sessionId/assignments" element={<Protected><Assignments /></Protected>} />
        <Route path="/wallet" element={<Protected><Wallet /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
