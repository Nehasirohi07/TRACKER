# OP ASCEND - Architecture Blueprint

## 1. Product Vision & App Concept

### Project Name
**OP ASCEND** - Operational Personal Advancement & Self-Command Environment for National Development

### Vision Statement
AI-powered military-themed self-improvement operating system that transforms students into disciplined, skilled professionals through gamified learning, structured goal tracking, and AI mentorship over an 18-month transformation program.

### Target Users
- Computer Science students preparing for tech careers
- Aspiring cybersecurity professionals
- Students preparing for CDS/SSC examinations
- English language learners
- Fitness enthusiasts seeking discipline
- Self-improvement enthusiasts

### Problem Statement
Students struggle with:
- Lack of structured learning paths
- No motivation system for long-term goals
- No integrated platform for multi-domain improvement
- No AI-powered mentorship
- Poor habit tracking and accountability
- Disconnected learning resources

### Solution
OP ASCEND provides:
- Unified dashboard for all improvement domains
- Gamified progression with military ranks
- AI mentor for 24/7 guidance
- Structured task and habit management
- Mock tests and progress analytics
- Streak and achievement system

---

## 2. Complete Feature List

### Authentication & Profile
- [x] User registration with email/password
- [x] Login with JWT tokens
- [x] Password reset functionality
- [x] Profile management (avatar, bio, goals)
- [x] Role-based access (User/Admin)
- [x] Session management

### Core Modules
- [x] Daily Mission/Task Management
- [x] Long-term Goal Tracker (18-month roadmap)
- [x] Habit Tracker (daily/weekly habits)
- [x] Coding Practice Tracker (LeetCode, GitHub integration)
- [x] AI/ML Learning Tracker (courses, projects)
- [x] Cyber Security Learning Tracker (labs, certifications)
- [x] CDS Exam Preparation Tracker
- [x] SSC CPO Exam Preparation Tracker
- [x] English Communication Tracker (speaking, writing)
- [x] Fitness Tracker (workouts, diet, measurements)
- [x] Mock Test & Quiz System

### Productivity Tools
- [x] Pomodoro Timer (25/5 technique)
- [x] Study Planner & Scheduler
- [x] Calendar integration
- [x] Notification system
- [x] Reminder system

### Gamification System
- [x] XP (Experience Points) system
- [x] Level progression (1-100)
- [x] Military rank progression (Private → General)
- [x] Achievement badges (50+ badges)
- [x] Streak tracking (daily/weekly/monthly)
- [x] Leaderboard (optional)

### AI & Intelligence
- [x] AI Mentor Chatbot (OpenAI integration)
- [x] AI-powered study recommendations
- [x] Progress prediction analytics

### Dashboard & Analytics
- [x] Tactical command center dashboard
- [x] Real-time progress charts
- [x] Weekly/Monthly reports
- [x] Data export (PDF, CSV)
- [x] Personal analytics

### Motivation & Content
- [x] Daily motivational quotes
- [x] Success stories
- [x] Tips and tricks
- [x] Mission briefings

### Admin Panel
- [x] User management
- [x] Content management
- [x] Analytics dashboard
- [x] System configuration

---

## 3. System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + TS)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Dashboard │ │   Tasks     │ │   AI Chat           │   │
│  │   Analytics │ │   Habits    │ │   Pomodoro          │   │
│  │   Profile   │ │   Goals     │ │   Gamification      │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS (SSL/TLS)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  LOAD BALANCER (Nginx)                      │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  FastAPI App  │   │  FastAPI App  │   │  FastAPI App  │
│   (Primary)   │   │   (Worker 1)  │   │   (Worker 2)  │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                          │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │  PostgreSQL     │    │    Redis        │                 │
│  │  (Main DB)      │    │  (Cache/Session)│                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  OpenAI     │ │  LeetCode   │ │  GitHub     │           │
│  │  API        │ │  API        │ │  API        │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | latest | Component Library |
| Framer Motion | 10.x | Animations |
| Recharts | 2.x | Charts |
| React Router | 6.x | Routing |
| Zustand | 4.x | State Management |
| React Query | 5.x | Server State |
| React Hook Form | 7.x | Form Handling |
| Zod | 3.x | Validation |
| Lucide React | latest | Icons |

#### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11 | Runtime |
| FastAPI | 0.104 | Web Framework |
| SQLAlchemy | 2.0 | ORM |
| Pydantic | 2.x | Validation |
| Python-Jose | 3.x | JWT |
| Passlib | 1.7 | Password Hashing |
| Uvicorn | 0.24 | ASGI Server |
| Psycopg2 | 2.9 | PostgreSQL Driver |
| Redis | 5.x | Cache |
| OpenAI | 1.x | AI Integration |

#### Database
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary Database |
| Redis | Session/Cache |

#### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Nginx | Reverse Proxy |
| GitHub Actions | CI/CD |

---

## 4. UI/UX Design System

### Design Philosophy
Military-themed, tactical command center aesthetic with clean, professional interface suitable for portfolio presentation.

### Color Palette
```css
:root {
  /* Primary Colors - Olive Green */
  --olive-900: #1a2e0f;
  --olive-800: #2d4a1c;
  --olive-700: #3d6526;
  --olive-600: #4d8033;
  --olive-500: #5c993d;
  --olive-400: #7ab85c;
  --olive-300: #a3d185;
  --olive-200: #c8e0b0;
  --olive-100: #e8f0d8;

  /* Neutral Colors - Steel Gray */
  --steel-950: #0a0c10;
  --steel-900: #12141c;
  --steel-800: #1a1d28;
  --steel-700: #252a38;
  --steel-600: #353b4a;
  --steel-500: #4a5264;
  --steel-400: #6b7280;
  --steel-300: #9ca3af;
  --steel-200: #d1d5db;
  --steel-100: #f3f4f6;

  /* Accent - Amber */
  --amber-500: #f59e0b;
  --amber-400: #fbbf24;
  --amber-300: #fcd34d;

  /* Status Colors */
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;
  --info: #3b82f6;

  /* Background */
  --bg-primary: #0a0c10;
  --bg-secondary: #12141c;
  --bg-tertiary: #1a1d28;
  --bg-card: #252a38;
}
```

### Typography
```css
/* Font Families */
--font-display: 'Orbitron', sans-serif;  /* Headers, Military feel */
--font-body: 'Inter', sans-serif;       /* Body text */
--font-mono: 'JetBrains Mono', monospace; /* Code */

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
--text-4xl: 2.25rem;
--text-5xl: 3rem;
```

### Spacing System
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
```

### Component Design

#### Cards
- Dark background (#1a1d28)
- Subtle border (steel-700)
- Rounded corners (8px)
- Hover effect (subtle glow)
- Shadow for depth

#### Buttons
- Primary: Olive green background
- Secondary: Steel gray outline
- Danger: Red for destructive
- Hover: Brightness increase
- Active: Scale down slightly
- Disabled: Opacity 50%

#### Inputs
- Dark background (#1a1d28)
- Border on focus (olive-500)
- Clear placeholder text
- Error state with red border

#### Progress Bars
- Animated fill
- Military-style segments
- Percentage display
- Color-coded by domain

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Logo, Nav, Profile, Notifications)                 │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│  SIDEBAR │              MAIN CONTENT                        │
│  (Nav)   │                                                   │
│          │                                                   │
│  - Home  │  ┌─────────────────────────────────────────┐    │
│  - Tasks │  │       PAGE CONTENT                       │    │
│  - Goals │  │       (Dashboard/Forms/Charts)           │    │
│  - Habits│  │                                           │    │
│  - Learn │  │                                           │    │
│  - Fitness│ │                                           │    │
│  - Chat  │  │                                           │    │
│  - Profile│ └─────────────────────────────────────────┘    │
│          │                                                   │
├──────────┴──────────────────────────────────────────────────┤
│  FOOTER (Status, Quick Actions)                              │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
```css
/* Mobile First */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Animations
- Page transitions: Fade + slide (300ms)
- Card hover: Scale 1.02, shadow increase
- Button click: Scale 0.98
- Progress bars: Smooth fill animation
- Charts: Staggered reveal
- Loading: Pulse animation
- Notifications: Slide in from right

---

## 5. Database Schema & ER Diagram

### Entity Relationship
```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Users     │       │   Profiles   │       │   Ranks     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──1:1──│ user_id (FK) │       │ id (PK)      │
│ email        │       │ bio          │       │ name         │
│ password_hash│       │ avatar_url   │       │ level_min    │
│ role         │       │ timezone     │       │ xp_required  │
│ created_at   │       │ updated_at   │       │ icon         │
│ is_active    │       └──────────────┘       └──────────────┘
└──────────────┘              │
       │                     │
       │ 1:N                 │
       ▼                     │
┌──────────────┐             │
│   Missions   │             │
├──────────────┤             │
│ id (PK)      │             │
│ user_id (FK) │             │
│ title        │             │
│ description  │             │
│ domain       │             │
│ priority     │             │
│ due_date     │             │
│ status       │             │
│ xp_reward    │             │
│ created_at   │             │
└──────────────┘             │
       │                     │
       │ 1:N                 │
       ▼                     │
┌──────────────┐       ┌──────────────┐
│  MissionLog  │       │   Habits     │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ mission_id   │       │ user_id (FK) │
│ user_id (FK) │       │ name         │
│ completed_at │       │ frequency    │
│ xp_earned    │       │ streak       │
└──────────────┘       │ best_streak  │
                       │ created_at   │
       ┌───────────────┘       │
       │                       │
       │ 1:N                   │
       ▼                       │
┌──────────────┐       ┌──────────────┐
│   Goals      │       │ HabitLogs    │
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ user_id (FK) │       │ habit_id(FK) │
│ title        │       │ completed_at │
│ description  │       │ user_id (FK) │
│ target_date  │       └──────────────┘
│ progress     │
│ domain       │       ┌──────────────┐
│ status       │       │  Achievements │
└──────────────┘       ├──────────────┤
       │               │ id (PK)      │
       │               │ name         │
       │               │ description  │
       │               │ icon         │
       │               │ criteria    │
       │               │ xp_reward   │
       ▼               └──────────────┘
┌──────────────┐
│    XPLog     │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ amount       │
│ source       │
│ description  │
│ created_at   │
└──────────────┘
```

### Database Tables

#### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### profiles
```sql
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    current_rank VARCHAR(50) DEFAULT 'Private',
    current_level INTEGER DEFAULT 1,
    total_xp INTEGER DEFAULT 0,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### missions (Tasks)
```sql
CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    domain VARCHAR(50),  -- 'coding', 'aiml', 'cybersec', 'cds', 'ssc', 'english', 'fitness'
    priority VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    xp_reward INTEGER DEFAULT 10,
    is_daily BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### goals
```sql
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    domain VARCHAR(50),
    target_date DATE,
    progress INTEGER DEFAULT 0, -- 0-100
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### habits
```sql
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    domain VARCHAR(50),
    frequency VARCHAR(20), -- 'daily', 'weekly'
    streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### habit_logs
```sql
CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### achievements
```sql
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    criteria JSONB,
    xp_reward INTEGER DEFAULT 50,
    category VARCHAR(50)
);
```

#### user_achievements
```sql
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);
```

#### xp_logs
```sql
CREATE TABLE xp_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source VARCHAR(50), -- 'mission', 'habit', 'goal', 'achievement', 'test'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### mock_tests
```sql
CREATE TABLE mock_tests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(50),
    total_questions INTEGER,
    duration_minutes INTEGER,
    passing_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### test_results
```sql
CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    test_id INTEGER REFERENCES mock_tests(id),
    score INTEGER,
    totalQuestions INTEGER,
    correct_answers INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### fitness_logs
```sql
CREATE TABLE fitness_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workout_type VARCHAR(100),
    duration_minutes INTEGER,
    calories_burned INTEGER,
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### pomodoro_sessions
```sql
CREATE TABLE pomodoro_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    duration_minutes INTEGER DEFAULT 25,
    task_type VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

#### chat_messages
```sql
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20), -- 'user', 'assistant'
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### learning_progress
```sql
CREATE TABLE learning_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    domain VARCHAR(50),
    resource_type VARCHAR(50), -- 'course', 'project', 'lab', 'book'
    resource_name VARCHAR(255),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. API Design & Endpoints

### Base URL
```
Production: https://api.opascend.io/v1
Development: http://localhost:8000/v1
```

### Authentication Endpoints
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login and get tokens
POST   /auth/refresh           - Refresh access token
POST   /auth/logout            - Logout (invalidate tokens)
POST   /auth/forgot-password   - Request password reset
POST   /auth/reset-password    - Reset password with token
GET    /auth/me                - Get current user info
```

### User/Profile Endpoints
```
GET    /users/profile          - Get user profile
PUT    /users/profile          - Update profile
PUT    /users/avatar            - Update avatar
GET    /users/stats             - Get user statistics
GET    /users/progress          - Get overall progress
```

### Mission/Task Endpoints
```
GET    /missions               - List all missions
POST   /missions               - Create new mission
GET    /missions/{id}          - Get mission details
PUT    /missions/{id}          - Update mission
DELETE /missions/{id}          - Delete mission
POST   /missions/{id}/complete - Mark mission as complete
GET    /missions/daily          - Get daily missions
GET    /missions/pending       - Get pending missions
```

### Goal Endpoints
```
GET    /goals                  - List all goals
POST   /goals                  - Create new goal
GET    /goals/{id}             - Get goal details
PUT    /goals/{id}             - Update goal
DELETE /goals/{id}            - Delete goal
PUT    /goals/{id}/progress    - Update progress
GET    /goals/active           - Get active goals
GET    /goals/completed        - Get completed goals
```

### Habit Endpoints
```
GET    /habits                 - List all habits
POST   /habits                 - Create new habit
GET    /habits/{id}            - Get habit details
PUT    /habits/{id}            - Update habit
DELETE /habits/{id}            - Delete habit
POST   /habits/{id}/complete   - Mark habit complete today
GET    /habits/today           - Get today's habits
GET    /habits/streaks         - Get streak information
```

### Gamification Endpoints
```
GET    /gamification/xp        - Get XP and level info
GET    /gamification/rank      - Get current rank
GET    /gamification/achievements - Get all achievements
POST   /gamification/achievements/claim - Claim achievement
GET    /gamification/leaderboard - Get leaderboard
GET    /gamification/xp-history - Get XP history
```

### Learning Endpoints
```
GET    /learning/coding        - Get coding progress
POST   /learning/coding        - Add coding activity
GET    /learning/aiml          - Get AI/ML progress
POST   /learning/aiml         - Add AI/ML learning
GET    /learning/cybersec      - Get cybersec progress
POST   /learning/cybersec      - Add cybersec learning
GET    /learning/exams         - Get exam prep progress
POST   /learning/exams         - Add exam prep activity
```

### Fitness Endpoints
```
GET    /fitness/logs           - Get fitness logs
POST   /fitness/logs           - Add fitness log
GET    /fitness/stats          - Get fitness statistics
GET    /fitness/workouts       - Get workout plans
```

### AI Chat Endpoints
```
POST   /chat                   - Send message to AI mentor
GET    /chat/history          - Get chat history
DELETE /chat/history          - Clear chat history
```

### Pomodoro Endpoints
```
POST   /pomodoro/start         - Start pomodoro session
POST   /pomodoro/complete     - Complete session
GET    /pomodoro/stats        - Get pomodoro statistics
```

### Analytics Endpoints
```
GET    /analytics/dashboard    - Get dashboard data
GET    /analytics/weekly      - Get weekly report
GET    /analytics/monthly     - Get monthly report
GET    /analytics/domains     - Get domain-wise progress
GET    /analytics/export      - Export data
```

### Admin Endpoints
```
GET    /admin/users            - List all users
GET    /admin/users/{id}      - Get user details
PUT    /admin/users/{id}      - Update user
DELETE /admin/users/{id}      - Delete user
GET    /admin/stats           - Get system statistics
GET    /admin/achievements    - Manage achievements
```

---

## 7. Folder Structure

### Backend (FastAPI)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration settings
│   ├── database.py            # Database connection
│   ├── security.py            # JWT, password hashing
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── mission.py
│   │   ├── goal.py
│   │   ├── habit.py
│   │   ├── achievement.py
│   │   ├── fitness.py
│   │   ├── chat.py
│   │   └── learning.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── mission.py
│   │   ├── goal.py
│   │   ├── habit.py
│   │   ├── auth.py
│   │   └── common.py
│   │
│   ├── routers/                # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── missions.py
│   │   ├── goals.py
│   │   ├── habits.py
│   │   ├── achievements.py
│   │   ├── fitness.py
│   │   ├── chat.py
│   │   ├── pomodoro.py
│   │   ├── analytics.py
│   │   └── admin.py
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── ai_service.py
│   │   ├── gamification.py
│   │   ├── notifications.py
│   │   └── analytics.py
│   │
│   └── utils/                  # Utilities
│       ├── __init__.py
│       ├── constants.py
│       └── helpers.py
│
├── requirements.txt
├── .env.example
├── Dockerfile
└── alembic/                    # Migrations
    └── versions/
```

### Frontend (React)
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── ui/                # shadcn components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── ProgressCharts.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   ├── missions/
│   │   │   ├── MissionList.tsx
│   │   │   ├── MissionCard.tsx
│   │   │   └── MissionForm.tsx
│   │   │
│   │   ├── gamification/
│   │   │   ├── XPBar.tsx
│   │   │   ├── RankBadge.tsx
│   │   │   └── Achievements.tsx
│   │   │
│   │   └── ai-chat/
│   │       ├── ChatWindow.tsx
│   │       └── MessageBubble.tsx
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Missions.tsx
│   │   ├── Goals.tsx
│   │   ├── Habits.tsx
│   │   ├── Learning.tsx
│   │   ├── Fitness.tsx
│   │   ├── Chat.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── Admin.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMissions.ts
│   │   ├── useGoals.ts
│   │   └── useChat.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── ai.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   └── appStore.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│       ├── constants.ts
│       ├── helpers.ts
│       └── cn.ts
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

---

## 8. Gamification System

### XP System
| Action | XP Reward |
|--------|-----------|
| Complete daily mission | 10-50 XP |
| Complete habit | 5-15 XP |
| Complete goal milestone | 50-100 XP |
| Pass mock test | 25-100 XP |
| Achieve achievement | 25-500 XP |
| Maintain streak | 10-50 XP |
| Daily login | 5 XP |
| First task of day | 10 XP |

### Level Progression
```
Level 1: 0 XP      → Private
Level 5: 500 XP    → Lance Corporal
Level 10: 1500 XP  → Corporal
Level 15: 3000 XP  → Sergeant
Level 20: 5000 XP  → Staff Sergeant
Level 25: 8000 XP  → Warrant Officer
Level 30: 12000 XP → Lieutenant
Level 40: 20000 XP → Captain
Level 50: 35000 XP → Major
Level 60: 55000 XP → Lieutenant Colonel
Level 70: 80000 XP → Colonel
Level 80: 120000 XP → Brigadier
Level 90: 180000 XP → Major General
Level 100: 250000 XP → General
```

### Achievement Categories
- **Missions**: Task completion milestones
- **Streaks**: Habit streak achievements
- **Learning**: Course completion badges
- **Fitness**: Workout milestones
- **Social**: Community involvement
- **Special**: Rare/secret achievements

---

## 9. 18-Month Progression Plan

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

## 10. Development Milestones

### Milestone 1: Project Setup (Week 1-2)
- Initialize FastAPI backend
- Initialize React frontend
- Set up PostgreSQL database
- Configure Docker
- Basic CI/CD pipeline

### Milestone 2: Authentication (Week 3-4)
- User registration
- JWT authentication
- Profile management
- Password reset

### Milestone 3: Core Dashboard (Week 5-6)
- Navigation system
- Dashboard layout
- Stats components
- Basic routing

### Milestone 4: Task System (Week 7-8)
- CRUD operations
- Task filtering
- Task completion
- Daily tasks

### Milestone 5: Goals & Habits (Week 9-10)
- Goal creation
- Progress tracking
- Habit system
- Streak tracking

### Milestone 6: Learning Modules (Week 11-12)
- Coding tracker
- AI/ML tracker
- Cybersec tracker
- Exam prep tracker

### Milestone 7: AI Mentor (Week 13-14)
- OpenAI integration
- Chat interface
- Context management

### Milestone 8: Gamification (Week 15-16)
- XP system
- Level progression
- Rank system
- Achievements

### Milestone 9: Analytics (Week 17-18)
- Charts and graphs
- Reports
- Export functionality

### Milestone 10: Deployment (Week 19-20)
- Docker configuration
- Nginx setup
- SSL/TLS
- Production deployment

---

## 11. Security Implementation

### Authentication Security
- Bcrypt password hashing (12 rounds)
- JWT tokens (15 min access, 7 day refresh)
- HTTPS only
- Rate limiting (100 req/min)
- Input validation with Pydantic
- SQL injection prevention (SQLAlchemy)
- XSS prevention (React sanitization)

### Authorization
- Role-based access control
- API endpoint protection
- Resource ownership validation

### Data Protection
- Environment variables for secrets
- Secure session management
- CORS configuration
- Audit logging

---

## 12. Resume-Worthy Features

1. **Full-stack development** - React + FastAPI
2. **AI Integration** - OpenAI ChatGPT integration
3. **Real-time features** - WebSocket for chat
4. **Gamification** - Complete XP/rank system
5. **Data visualization** - Recharts integration
6. **Authentication** - JWT with refresh tokens
7. **Database design** - PostgreSQL with proper schema
8. **DevOps** - Docker, Nginx, CI/CD
9. **Security** - bcrypt, rate limiting, RBAC
10. **Responsive design** - Mobile-first UI

---

## 13. Final Year Project Presentation

### Project Demo Flow (10 minutes)
1. Introduction (1 min) - Project overview
2. Demo (5 min) - Live walkthrough
3. Technical (2 min) - Architecture highlights
4. Q&A (2 min) - Questions

### Documentation Required
- Project report (50+ pages)
- Architecture diagram
- Database schema
- API documentation
- User manual
- Test cases

---

## 14. Monetization Strategy (Future)

### Free Tier
- Basic features
- Limited AI chat
- Basic analytics

### Premium ($9.99/month)
- Unlimited AI chat
- Advanced analytics
- Priority support
- Custom themes

### Enterprise ($49.99/month)
- Multiple users
- Team features
- Custom branding
- API access

---

This completes the architecture blueprint for OP ASCEND. Next, I'll create the project with Milestone 1: Project Setup.