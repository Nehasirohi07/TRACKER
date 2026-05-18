# OP ASCEND - Architecture Blueprint & Implementation Guide

## Project Overview

**OP ASCEND** (Operational Personal Advancement & Self-Command Environment for National Development) is an AI-powered military-themed self-improvement operating system built as a full-stack web application. It's designed to help a Computer Science student systematically transform over 18 months across multiple domains:

- AI/ML Career Preparation
- Cyber Security Career Preparation
- CDS Exam Preparation
- SSC CPO Exam Preparation
- English Communication Improvement
- Fitness and Discipline Development

---

## Technology Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- Framer Motion (animations)
- Recharts (data visualization)
- Zustand (state management)
- React Query (server state)

### Backend
- Python 3.11
- FastAPI
- SQLAlchemy 2.0
- Pydantic v2
- JWT Authentication
- PostgreSQL
- Redis (optional)

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 16+
- Docker (optional)

### Option 1: Docker Setup (Recommended)

```bash
# Clone and navigate to project
cd tracker

# Create .env file for backend
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build

# Access at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/v1
# API Docs: http://localhost:8000/v1/docs
```

### Option 2: Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/op_ascend
SECRET_KEY=your-secret-key

# Run migrations
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"

# Start server
python -m app.main
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
tracker/
├── backend/
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   │   ├── user.py     # User, Profile
│   │   │   ├── mission.py  # Tasks/missions
│   │   │   ├── goal.py     # Long-term goals
│   │   │   ├── habit.py    # Daily habits
│   │   │   ├── achievement.py  # XP, achievements
│   │   │   ├── fitness.py  # Workout logs
│   │   │   ├── chat.py     # AI chat messages
│   │   │   └── learning.py # Learning progress
│   │   │
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── utils/         # Constants, helpers
│   │   ├── config.py      # Settings
│   │   ├── database.py    # DB connection
│   │   ├── security.py    # JWT, password hashing
│   │   └── main.py        # FastAPI app
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/        # shadcn-style components
│   │   │   ├── layout/    # Header, Sidebar, Layout
│   │   │   └── pages/    # All page components
│   │   ├── pages/        # React pages
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API functions
│   │   ├── store/        # Zustand stores
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Helpers
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── SPEC.md              # Detailed specification
```

---

## API Endpoints

### Authentication
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login
- `POST /v1/auth/refresh` - Refresh token
- `GET /v1/auth/me` - Current user

### Missions (Tasks)
- `GET /v1/missions` - List all missions
- `POST /v1/missions` - Create mission
- `PUT /v1/missions/{id}` - Update mission
- `POST /v1/missions/{id}/complete` - Complete mission
- `DELETE /v1/missions/{id}` - Delete mission

### Goals
- `GET /v1/goals` - List all goals
- `POST /v1/goals` - Create goal
- `PUT /v1/goals/{id}/progress` - Update progress
- `PUT /v1/goals/{id}` - Update goal

### Habits
- `GET /v1/habits` - List all habits
- `GET /v1/habits/today` - Today's habits
- `POST /v1/habits` - Create habit
- `POST /v1/habits/{id}/complete` - Complete habit

### Learning
- `GET /v1/learning/{domain}` - Get learning progress by domain
- `POST /v1/learning` - Add learning resource

### Gamification
- `GET /v1/gamification/xp` - XP info and rank
- `GET /v1/gamification/achievements` - All achievements

### Chat
- `POST /v1/chat` - Send message to AI
- `GET /v1/chat/history` - Get chat history

### Fitness
- `GET /v1/fitness/logs` - Workout logs
- `POST /v1/fitness/logs` - Add workout
- `GET /v1/fitness/stats` - Fitness statistics

### Analytics
- `GET /v1/analytics/dashboard` - Dashboard data
- `GET /v1/analytics/weekly` - Weekly report
- `GET /v1/analytics/domains` - Domain progress

---

## Gamification System

### XP Rewards
- Mission complete: 10-50 XP
- Habit complete: 5-15 XP
- Goal milestone: 50-100 XP
- Test pass: 25-100 XP
- Daily login: 5 XP

### Military Ranks
| Level | Rank | XP Required |
|-------|------|-------------|
| 1 | Private | 0 |
| 5 | Lance Corporal | 500 |
| 10 | Corporal | 1,500 |
| 15 | Sergeant | 3,000 |
| 20 | Staff Sergeant | 5,000 |
| 30 | Lieutenant | 12,000 |
| 50 | Major | 35,000 |
| 100 | General | 250,000 |

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [x] Project setup with Docker
- [x] Authentication system (JWT)
- [x] Basic dashboard layout
- [x] Mission/task CRUD

### Phase 2: Core Features (Weeks 5-8)
- [x] Goals system
- [x] Habit tracker with streaks
- [x] XP and rank system
- [x] Achievements

### Phase 3: Advanced (Weeks 9-12)
- [x] Learning tracker by domain
- [x] Fitness tracking
- [x] Pomodoro timer
- [x] AI Chat mentor

### Phase 4: Polish (Weeks 13-16)
- [x] Analytics dashboard
- [x] Settings page
- [x] Data export
- [ ] Mobile responsiveness fixes

### Phase 5: Deployment (Weeks 17-20)
- [ ] Production Docker setup
- [ ] Nginx reverse proxy
- [ ] SSL/TLS
- [ ] CI/CD with GitHub Actions

---

## Resume-Worthy Features

1. **Full-stack development** - React + FastAPI
2. **AI Integration** - OpenAI ChatGPT integration ready
3. **Real-time features** - WebSocket ready for chat
4. **Gamification** - Complete XP/rank/achievement system
5. **Data visualization** - Recharts integration
6. **Authentication** - JWT with refresh tokens
7. **Database design** - PostgreSQL with proper schema
8. **DevOps** - Docker, Nginx, CI/CD ready
9. **Security** - bcrypt, rate limiting, RBAC
10. **Responsive design** - Mobile-first UI

---

## 18-Month Progression Plan

### Phase 1: Foundation (Months 1-3)
- Complete basic setup
- Establish daily habits
- Complete onboarding missions
- Reach Level 10
- Earn first 10 achievements

### Phase 2: Build (Months 4-6)
- Advanced features
- Learning modules
- Mock tests
- Reach Level 25
- Complete first major goal

### Phase 3: Optimize (Months 7-9)
- AI integration
- Advanced analytics
- Community features
- Reach Level 40
- Comprehensive learning

### Phase 4: Master (Months 10-12)
- Expert-level content
- Leadership features
- Reach Level 50
- Career preparation

### Phase 5: Excellence (Months 13-18)
- Full gamification
- Advanced AI features
- Leadership board
- Reach Level 70+
- Career success

---

## Final Year Project Presentation

### Demo Flow (10 minutes)
1. **Introduction** (1 min) - Project overview
2. **Demo** (5 min) - Live walkthrough
3. **Technical** (2 min) - Architecture highlights
4. **Q&A** (2 min) - Questions

### Documentation Required
- Project report (50+ pages)
- Architecture diagram
- Database schema
- API documentation
- User manual
- Test cases

---

## Contributing

This is a personal project for the B.Tech final year. Feel free to fork and extend!

---

## License

MIT License