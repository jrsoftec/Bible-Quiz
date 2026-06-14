from sqlalchemy import select
from sqlalchemy.orm import Session
from . import models
from .auth import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str):
    return db.execute(select(models.User).where(models.User.email == email)).scalar_one_or_none()


def create_user(db: Session, email: str, password: str, is_admin: bool = False):
    hashed_password = get_password_hash(password)
    user = models.User(email=email, hashed_password=hashed_password, is_admin=is_admin)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_question(db: Session, text: str, choices: list[str], correct_choice_index: int, image_url: str | None = None, youtube_url: str | None = None):
    question = models.Question(text=text, image_url=image_url, youtube_url=youtube_url)
    db.add(question)
    db.flush()
    for index, choice_text in enumerate(choices):
        choice = models.Choice(
            question_id=question.id,
            text=choice_text,
            is_correct=(index == correct_choice_index),
        )
        db.add(choice)
    db.commit()
    db.refresh(question)
    return question


def get_question(db: Session, question_id: int):
    return db.execute(select(models.Question).where(models.Question.id == question_id)).scalar_one_or_none()


def list_questions(db: Session):
    return db.execute(select(models.Question).order_by(models.Question.id)).scalars().all()


def create_attempt(db: Session, user_id: int, question_id: int, selected_choice_id: int):
    choice = db.execute(select(models.Choice).where(models.Choice.id == selected_choice_id)).scalar_one_or_none()
    if not choice or choice.question_id != question_id:
        return None
    is_correct = choice.is_correct
    attempt = models.Attempt(
        user_id=user_id,
        question_id=question_id,
        selected_choice_id=selected_choice_id,
        is_correct=is_correct,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


def compute_score(db: Session, user_id: int):
    total_answered = db.execute(select(models.Attempt).where(models.Attempt.user_id == user_id)).scalars().all()
    total_answered_count = len(total_answered)
    total_correct = sum(1 for attempt in total_answered if attempt.is_correct)
    accuracy = (total_correct / total_answered_count * 100) if total_answered_count else 0.0
    return total_answered_count, total_correct, accuracy


def bulk_create_questions(db: Session, questions: list[dict]):
    created = []
    for item in questions:
        created.append(
            create_question(
                db,
                text=item['text'],
                choices=item['choices'],
                correct_choice_index=item['correct_choice_index'],
                image_url=item.get('image_url'),
                youtube_url=item.get('youtube_url'),
            )
        )
    return created
