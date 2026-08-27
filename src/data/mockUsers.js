// Mock campus students for the matchmaking demo.
// In the real backend this would come from Firestore/PostgreSQL user profiles.
export const mockUsers = [
  {
    id: 'u1',
    name: 'Ananya Rao',
    year: '3rd Year, CSE',
    teaches: ['Python', 'Data Structures', 'Public Speaking'],
    learns: ['Video Editing', 'Guitar'],
    rating: 4.8,
    sessionsTaught: 12
  },
  {
    id: 'u2',
    name: 'Rahul Menon',
    year: '2nd Year, ECE',
    teaches: ['Guitar', 'Music Production'],
    learns: ['Python', 'Resume Design'],
    rating: 4.6,
    sessionsTaught: 7
  },
  {
    id: 'u3',
    name: 'Sneha Iyer',
    year: 'Final Year, CSE',
    teaches: ['Resume Design', 'Interview Prep', 'Excel'],
    learns: ['Public Speaking', 'Video Editing'],
    rating: 4.9,
    sessionsTaught: 20
  },
  {
    id: 'u4',
    name: 'Kabir Sharma',
    year: '3rd Year, Mech',
    teaches: ['Video Editing', 'Photography'],
    learns: ['Data Structures', 'Excel'],
    rating: 4.5,
    sessionsTaught: 5
  },
  {
    id: 'u5',
    name: 'Meera Nair',
    year: '1st Year, CSE',
    teaches: ['Spoken English'],
    learns: ['Python', 'Data Structures'],
    rating: 4.2,
    sessionsTaught: 2
  }
]
