// src/services/liveSessionService.js
// All Firestore reads/writes for live sessions go through here — same idea
// as aiService.js being the one place AI calls happen.
import { db } from './firebase.js'
import {
  addDoc, arrayUnion, collection, doc, getDoc,
  onSnapshot, orderBy, query, serverTimestamp, updateDoc, where
} from 'firebase/firestore'

const sessionsRef = collection(db, 'liveSessions')

export function subscribeToLiveSessions(callback) {
  const q = query(sessionsRef, where('status', '==', 'live'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export async function createLiveSession({
  hostId,
  hostName,
  skill,
  level,
  sessionType = 'Chat',
  maxParticipants = 2,
  durationMinutes = 30,
  date = '',
  time = '',
  learningGoal = '',
  topic = ''
}) {
  const docRef = await addDoc(sessionsRef, {
    skill,
    topic: topic || skill,
    level,
    sessionType,
    maxParticipants: Number(maxParticipants) || 2,
    durationMinutes: Number(durationMinutes) || 30,
    date: date || new Date().toISOString().slice(0, 10),
    time: time || '09:00',
    learningGoal: learningGoal || 'Practice the key concept and build confidence.',
    hostId,
    hostName,
    participantIds: [hostId],
    status: 'live',
    createdAt: serverTimestamp(),
    startedAt: serverTimestamp()
  })
  return docRef.id
}

export async function joinLiveSession(sessionId, userId) {
  await updateDoc(doc(db, 'liveSessions', sessionId), {
    participantIds: arrayUnion(userId)
  })
}

export async function endLiveSession(sessionId) {
  await updateDoc(doc(db, 'liveSessions', sessionId), { status: 'ended' })
}

export async function getLiveSession(sessionId) {
  const snap = await getDoc(doc(db, 'liveSessions', sessionId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export function subscribeToMessages(sessionId, callback) {
  const q = query(collection(db, 'liveSessions', sessionId, 'messages'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export async function sendMessage(sessionId, { role, senderId, senderName, content }) {
  await addDoc(collection(db, 'liveSessions', sessionId, 'messages'), {
    role, senderId, senderName, content, createdAt: serverTimestamp()
  })
}
