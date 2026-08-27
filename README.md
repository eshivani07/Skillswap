# 🔄 SkillSwap

**A peer-to-peer skill exchange & mentorship platform where every student can learn something new by teaching something they already know.**

![Status](https://img.shields.io/badge/status-Phase%202%20Prototype-blue)
![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Firebase](https://img.shields.io/badge/backend-Firebase-FFCA28)

---

## 📌 Problem Statement

**Track:** Omni_EdTech_10 — Peer-to-Peer Skill Exchange Among Students

Every campus is full of untapped teaching talent — a senior fluent in Python, a classmate who plays guitar, a topper who has cracked spoken English. Yet there is no structured, trusted way for students to find each other and exchange these skills.

**Core pain points:**
- No structured channel to teach or learn — peer learning happens only through chance conversations
- Paid tutoring is expensive or inaccessible
- Skilled peers are hard to discover outside a student's immediate friend circle
- No incentive or recognition for students who are willing to teach
- Classroom learning misses practical, real-world skills (resume design, interview prep, communication)
- Trust & safety concerns around connecting with strangers online

---

## 💡 Solution

SkillSwap lets every student maintain two lists — **skills they can teach** and **skills they want to learn** — and an AI-driven matchmaking engine connects compatible students for structured, one-on-one or group learning sessions.

Instead of money, the platform runs on a fair barter-credit economy: **teach for an hour, earn a SkillCoin; spend a SkillCoin to learn from someone else.**

| Problem | SkillSwap's Response |
|---|---|
| No structured channel | Every student gets a skill profile; sessions are booked, scheduled, and tracked in-app |
| Cost of tutoring | Cashless SkillCoin barter system — free to use |
| Discovery difficulty | AI matchmaking engine recommends the best-fit teacher/learner |
| No incentive to teach | SkillCoins, ratings, badges, and a public teaching portfolio |
| Classroom–practical gap | Open skill categories beyond academics — design, coding, communication, hobbies |
| Trust & safety | Verified accounts, post-session ratings, reporting, and blocking |

---

## ✨ Key Features

### ✅ Built in this prototype (Phase 2)
- **Skill Profile** — add skills you can teach and skills you want to learn, with year/branch info
- **AI-style Matchmaking (Discover)** — ranks potential learning partners by skill overlap, rating, and sessions taught
- **Session tracking** — view scheduled/past sessions
- **SkillCoin Wallet** — see current coin balance
- **Login flow** — student authentication screen

### 🚧 Planned (Phase 2 roadmap → Phase 3)
- Real Firebase Authentication (Email/Google) — Firebase project connected, integration in progress
- Firestore-backed user profiles, sessions, and wallet (currently uses mock data for demo)
- Live text chat & video calling between matched users
- Verified skill badges via quiz-based assessment
- Leaderboards, teaching streaks, and campus-wide challenges
- AI session summarizer (auto-generated notes & follow-up suggestions)

---

## 🏗️ System Architecture

**Client Layer**
- Student Web App (React + Vite)

**Gateway**
- API Gateway + Authentication (Firebase Auth)

**Core Services**
- Matching Engine
- Session & Booking
- Chat & Video
- SkillCoin Wallet
- Notification Service

**Data Layer (Firestore)**
- Users & Profiles
- Skills & Sessions
- Transactions (Wallet)
- Ratings & Reports

**External Integrations**
- WebRTC / Video SDK
- Firebase Cloud Messaging
- AI Provider (OpenAI / Gemini)

> Requests flow top-down: the client talks to the API Gateway, which routes to the relevant core service, which reads/writes to Firestore, and calls external integrations (video, notifications, AI) as needed.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev experience, component-based UI |
| Backend / Auth / DB | Firebase (Auth + Firestore) | Serverless, quick to ship, real-time sync |
| AI Layer | OpenAI / Gemini API *(planned)* | Powers matchmaking scoring & session summaries |
| Hosting | Firebase Hosting *(planned)* | Simple CI/CD, generous free tier |
| Mobile (future) | Flutter | Cross-platform native app |

---

## 📂 Project Structure
skillswap-app/
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── utils/
│   ├── firebase.js
│   └── main.jsx
├── firestore.rules
├── .env.example
└── vite.config.js


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
git clone https://github.com/eshivani07/Skillswap.git
cd Skillswap
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and add your own Firebase project credentials:

```bash
cp .env.example .env
```

Then fill in the values from your Firebase Console → Project Settings → Your apps.

### Run locally

```bash
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

---

## 📖 Current Status

This is a **Phase 2 hackathon prototype**. The core UI/UX flows — Discover (AI-style matching), Profile, Sessions, and Wallet — are built and functional using **mock data** to demonstrate the intended product experience end-to-end.

A Firebase project is connected and configured (`src/firebase.js`, `firestore.rules`) as the foundation for the next milestone: replacing mock data with real Firebase Authentication and Firestore-backed data.

---

## 🗺️ Roadmap

- [x] UX flows & wireframes
- [x] Frontend prototype with mock data (Discover, Profile, Sessions, Wallet)
- [x] Firebase project setup (Auth + Firestore config)
- [ ] Real Firebase Authentication (sign up / login)
- [ ] Firestore-backed skill profiles & sessions
- [ ] AI matchmaking scoring via OpenAI/Gemini API
- [ ] In-app chat & video sessions
- [ ] SkillCoin wallet with real transactions
- [ ] Ratings, reporting & moderation
- [ ] Pilot launch with a student group

---

## 👥 Team

Built for **Omni_EdTech_10 — Peer-to-Peer Skill Exchange Among Students**

- **Koudagani Sahithya**
- **Elagam Shivani** — [@eshivani07](https://github.com/eshivani07)
