/**
 * Generate a unique session key for private sessions
 * Format: SKL-8F42Q
 */
function generateSessionKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = 'SKL-'
  for (let i = 0; i < 5; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

// Helper to create session with proper timing
function createSession(overrides = {}) {
  const startTime = overrides.startTime || new Date(Date.now() - (overrides.minutesElapsed || 0) * 60000)
  const duration = overrides.durationMinutes || 30
  const endTime = new Date(startTime.getTime() + duration * 60000)
  
  return {
    startTime,
    endTime,
    ...overrides,
    durationMinutes: duration
  }
}

export const mockSessions = [
  createSession({
    id: 'session-001',
    topic: 'C Programming',
    skill: 'C Programming',
    level: 'Beginner',
    type: 'Chat',
    sessionType: 'Chat',
    host: 'Arjun',
    hostName: 'Arjun',
    hostId: 'user-001',
    participants: 2,
    maxParticipants: 4,
    durationMinutes: 30,
    minutesElapsed: 10,
    currentTopic: 'Variables',
    goal: 'Learn variables and data types',
    learningGoal: 'Understand variables, data types, and basic input/output.',
    visibility: 'public',
    sessionKey: null,
    isLive: true,
    date: '2026-09-01',
    time: '18:00',
    participantIds: ['user-001', 'user-007'],
    progress: [
      { id: 1, title: 'Warm-up discussion', done: true },
      { id: 2, title: 'Core concept', done: true },
      { id: 3, title: 'Worked example', done: false },
      { id: 4, title: 'Practice task', done: false },
      { id: 5, title: 'Review and recap', done: false }
    ]
  }),
  createSession({
    id: 'session-002',
    topic: 'Python Functions',
    skill: 'Python',
    level: 'Intermediate',
    type: 'Video',
    sessionType: 'Video',
    host: 'Priya',
    hostName: 'Priya',
    hostId: 'user-002',
    participants: 3,
    maxParticipants: 4,
    durationMinutes: 60,
    minutesElapsed: 5,
    currentTopic: 'Functions',
    goal: 'Understand functions and parameters',
    learningGoal: 'Practice functions, parameters, and return values.',
    visibility: 'private',
    sessionKey: 'SKL-8F42Q',
    isLive: true,
    date: '2026-09-02',
    time: '19:30',
    participantIds: ['user-002', 'user-008', 'user-009'],
    progress: [
      { id: 1, title: 'Warm-up discussion', done: true },
      { id: 2, title: 'Core concept', done: false },
      { id: 3, title: 'Worked example', done: false },
      { id: 4, title: 'Practice task', done: false },
      { id: 5, title: 'Review and recap', done: false }
    ]
  }),
  createSession({
    id: 'session-003',
    topic: 'Public Speaking',
    skill: 'Public Speaking',
    level: 'Beginner',
    type: 'Audio',
    sessionType: 'Audio',
    host: 'Sneha',
    hostName: 'Sneha',
    hostId: 'user-003',
    participants: 4,
    maxParticipants: 6,
    durationMinutes: 45,
    minutesElapsed: 15,
    currentTopic: 'Voice Modulation',
    goal: 'Build confidence and vocal techniques',
    learningGoal: 'Build confidence speaking clearly and engaging an audience.',
    visibility: 'public',
    sessionKey: null,
    isLive: true,
    date: '2026-09-03',
    time: '17:00',
    participantIds: ['user-003', 'user-010', 'user-011', 'user-012'],
    progress: [
      { id: 1, title: 'Warm-up discussion', done: true },
      { id: 2, title: 'Core concept', done: true },
      { id: 3, title: 'Worked example', done: false },
      { id: 4, title: 'Practice task', done: false },
      { id: 5, title: 'Review and recap', done: false }
    ]
  }),
  createSession({
    id: 'session-004',
    topic: 'JavaScript ES6',
    skill: 'JavaScript',
    level: 'Intermediate',
    type: 'Chat',
    sessionType: 'Chat',
    host: 'Rohan',
    hostName: 'Rohan',
    hostId: 'user-004',
    participants: 2,
    maxParticipants: 3,
    durationMinutes: 45,
    minutesElapsed: 20,
    currentTopic: 'Arrow Functions',
    goal: 'Master modern JavaScript features',
    learningGoal: 'Learn arrow functions, destructuring, and spread operator.',
    visibility: 'private',
    sessionKey: 'SKL-PQR12',
    isLive: true,
    date: '2026-09-04',
    time: '16:00',
    participantIds: ['user-004', 'user-013'],
    progress: [
      { id: 1, title: 'Warm-up discussion', done: true },
      { id: 2, title: 'Core concept', done: true },
      { id: 3, title: 'Worked example', done: true },
      { id: 4, title: 'Practice task', done: false },
      { id: 5, title: 'Review and recap', done: false }
    ]
  }),
  createSession({
    id: 'session-005',
    topic: 'Data Structures',
    skill: 'Data Structures',
    level: 'Advanced',
    type: 'Video',
    sessionType: 'Video',
    host: 'Vikram',
    hostName: 'Vikram',
    hostId: 'user-005',
    participants: 5,
    maxParticipants: 8,
    durationMinutes: 90,
    minutesElapsed: 25,
    currentTopic: 'Trees and Graphs',
    goal: 'Deep dive into complex data structures',
    learningGoal: 'Understand trees, graphs, and their applications in algorithms.',
    visibility: 'public',
    sessionKey: null,
    isLive: true,
    date: '2026-09-05',
    time: '20:00',
    participantIds: ['user-005', 'user-014', 'user-015', 'user-016', 'user-017'],
    progress: [
      { id: 1, title: 'Warm-up discussion', done: true },
      { id: 2, title: 'Core concept', done: true },
      { id: 3, title: 'Worked example', done: true },
      { id: 4, title: 'Practice task', done: false },
      { id: 5, title: 'Review and recap', done: false }
    ]
  }),
  createSession({
    id: 'session-006',
    topic: 'UI/UX Design',
    skill: 'UI/UX Design',
    level: 'Beginner',
    type: 'Video',
    sessionType: 'Video',
    host: 'Maya',
    hostName: 'Maya',
    hostId: 'user-006',
    participants: 3,
    maxParticipants: 5,
    durationMinutes: 60,
    minutesElapsed: 12,
    currentTopic: 'Design Principles',
    goal: 'Learn fundamental design principles',
    learningGoal: 'Understand color theory, typography, and layout principles.',
    visibility: 'public',
    sessionKey: null,
    isLive: true,
    date: '2026-09-06',
    time: '18:30',
    participantIds: ['user-006', 'user-018', 'user-019'],
    progress: [
      { id: 1, title: 'Warm-up discussion', done: true },
      { id: 2, title: 'Core concept', done: true },
      { id: 3, title: 'Worked example', done: false },
      { id: 4, title: 'Practice task', done: false },
      { id: 5, title: 'Review and recap', done: false }
    ]
  })
]
