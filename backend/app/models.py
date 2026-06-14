from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    attempts = relationship('Attempt', back_populates='user')


class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    choices = relationship('Choice', back_populates='question', cascade='all, delete-orphan')
    attempts = relationship('Attempt', back_populates='question')


class Choice(Base):
    __tablename__ = 'choices'
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey('questions.id', ondelete='CASCADE'))
    text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    question = relationship('Question', back_populates='choices')
    attempts = relationship('Attempt', back_populates='selected_choice')


class Attempt(Base):
    __tablename__ = 'attempts'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    question_id = Column(Integer, ForeignKey('questions.id', ondelete='CASCADE'))
    selected_choice_id = Column(Integer, ForeignKey('choices.id', ondelete='CASCADE'))
    is_correct = Column(Boolean, default=False, nullable=False)
    answered_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user = relationship('User', back_populates='attempts')
    question = relationship('Question', back_populates='attempts')
    selected_choice = relationship('Choice', back_populates='attempts')
