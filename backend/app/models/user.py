from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False)
    missions = relationship("Mission", back_populates="user")
    goals = relationship("Goal", back_populates="user")
    habits = relationship("Habit", back_populates="user")
    xp_logs = relationship("XPLog", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")
    fitness_logs = relationship("FitnessLog", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")
    pomodoro_sessions = relationship("PomodoroSession", back_populates="user")
    learning_progress = relationship("LearningProgress", back_populates="user")
    test_results = relationship("TestResult", back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    username = Column(String(100))
    bio = Column(String(500))
    avatar_url = Column(String(500))
    current_rank = Column(String(50), default="Private")
    current_level = Column(Integer, default=1)
    total_xp = Column(Integer, default=0)
    timezone = Column(String(50), default="Asia/Kolkata")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")