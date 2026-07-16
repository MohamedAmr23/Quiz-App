<div align="center">

<img src="https://quiz-app-4xvg.vercel.app/_next/static/media/Logo-white.28q7l95cfitgp.svg" alt="QuizWiz Logo" width="120" />

# QuizWiz

**A modern, full-stack quiz platform for instructors and students.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://quiz-app-4xvg.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

</div>

---

## 📖 Overview

QuizWiz is a role-based quiz management platform built for educational environments. Instructors can create and manage quizzes, monitor student results, and organise groups — while students join live quiz sessions, answer questions in a focused single-page exam view, and instantly review their performance with detailed score analytics.

---

## ✨ Features

### 👨‍🏫 Instructor
- **Dashboard** — overview of upcoming quizzes and top-performing students
- **Quiz management** — create, edit, and delete quizzes with full configuration (schedule, duration, difficulty, score per question, question type)
- **Question bank** — build and manage a reusable library of MCQ questions
- **Group management** — organise students into groups and assign quizzes
- **Student management** — view enrolled students and their progress
- **Results overview** — see all submissions with scores and answer breakdowns
- **Generate Questions** *(AI-powered)* — auto-generate MCQ questions by technology and difficulty using the Open Trivia DB

### 🎓 Student
- **Personalised dashboard** — greeting banner, XP level system, stat cards (completed, avg score, best score, upcoming), recent performance chart, and upcoming quiz list
- **Join quiz by code** — enter a session code to instantly join an open quiz
- **Immersive exam view** — full-page single-question-per-screen layout with progress bar, dot navigation, and animated option cards
- **Instant results** — score hero card with pass/fail indicator, correct/wrong/skipped stats, accuracy bar, and per-question answer review with colour-coded options
- **Results history** — browse all past submissions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios (with request/response interceptors) |
| Icons | Lucide React |
| Auth | JWT — stored in `localStorage`, auto-attached via Axios interceptor |
| Deployment | Vercel |
| Backend API | REST — `https://upskilling-egypt.com:3005/api` |

---
## ScreenShots
## Instructor
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3bbafb33-1eac-402c-918e-d0f79231582f" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/108d5e0a-204d-407d-82b5-8d2abe6cbc9f" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/40916718-78bd-454b-a9c2-78b9f77cd5aa" />

## student
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2b4b8d96-f070-49e3-9d56-0e9995b8fafe" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/480879e0-2bff-4eef-981c-66b12130cfb8" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cd89a280-832f-4a53-ab5c-4ba7dadf7863" />

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/MohamedAmr23/Quiz-App.git
cd Quiz-App
git checkout staging

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# then edit .env.local and set:
# NEXT_PUBLIC_API_URL=https://upskilling-egypt.com:3005/api

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Login, Register, Forgot/Reset password
│   ├── (main)/
│   │   ├── dashboard/          # Role-based dashboard
│   │   ├── quizzes/            # Quiz list + results
│   │   ├── questions/          # Question bank (instructor)
│   │   ├── groups/             # Group management (instructor)
│   │   ├── students/           # Student list (instructor)
│   │   └── generate-questions/ # AI question generator (instructor)
├── features/
│   ├── dashboard/components/   # Dashboard widgets (instructor + student)
│   ├── quizzes/components/     # Quiz cards, modals, exam view, results
│   └── ...
└── shared/
    ├── lib/
    │   ├── apis/axiosClient.ts  # Axios instance + auth interceptor
    │   ├── services/            # API service functions
    │   ├── types/               # Shared TypeScript interfaces
    │   └── utils/auth.ts        # Role helpers (isStudent, isInstructor)
    └── components/              # Shared UI components (Navbar, Sidebar…)
```

---

## 🔐 Authentication & Roles

QuizWiz uses two roles, determined at login and stored in `localStorage` under `userProfile`:

| Role | Access |
|---|---|
| **Instructor** | Full dashboard, quiz/question/group/student management, results, question generator |
| **Student** | Personal dashboard, join quiz by code, exam flow, own results |

Tokens are automatically attached to every API request via an Axios request interceptor. Expired or unauthorised responses (401) trigger an automatic logout and redirect to `/login`, except on auth endpoints.

---

## 📱 Key Screens

### Student Exam Flow
1. Click **Join Quiz** → enter the session code
2. Backend join call returns a session + quiz ID
3. Questions are fetched without answers (`GET /quiz/without-answers/:id`)
4. Student answers one question at a time, navigates with Previous / Next
5. Submit → results page shows score ring, pass/fail, correct & wrong answer review

### Instructor Quiz Creation
1. Open **New Quiz** modal → fill title, description, schedule, duration, difficulty, type, score per question
2. Assign to a group
3. Quiz appears in Upcoming Quizzes for enrolled students

---

## 🌐 Live Demo

**[https://quiz-app-4xvg.vercel.app](https://quiz-app-4xvg.vercel.app)**

> Use the Sign Up flow to create an account. Role assignment is handled by the backend.

---

## 🤝 Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR against staging
git push origin feature/your-feature-name
```

Please follow the existing code style (TypeScript strict, Tailwind utility classes, no inline styles).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ using Next.js & Tailwind CSS
</div>
