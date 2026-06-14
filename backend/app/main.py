from pathlib import Path
import shutil
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import models, crud, auth
from .database import engine
from .deps import get_db, get_current_user, get_current_admin
from .schemas import (
    Token,
    TokenData,
    UserCreate,
    UserRead,
    QuestionRead,
    AnswerCreate,
    AnswerResult,
    ScoreRead,
    BulkQuestionItem,
    UploadResult,
    QuestionCreateForm,
)

UPLOAD_DIR = Path(__file__).resolve().parent.parent / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title='Bible Quiz API')
app.mount('/uploads', StaticFiles(directory=UPLOAD_DIR), name='uploads')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.post('/token', response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect email or password')
    access_token = auth.create_access_token(data={'sub': user.email})
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'email': user.email,
        'is_admin': user.is_admin,
    }


@app.post('/register', response_model=UserRead)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_create.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Email already registered')
    user = crud.create_user(db, user_create.email, user_create.password)
    return user


@app.post('/admin/init', response_model=UserRead)
def create_admin(db: Session = Depends(get_db)):
    admin = crud.get_user_by_email(db, auth.settings.admin_email)
    if admin:
        return admin
    return crud.create_user(db, auth.settings.admin_email, auth.settings.admin_password, is_admin=True)


@app.post('/admin/questions', response_model=list[QuestionRead])
def create_question(question_in: QuestionCreateForm, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    question = crud.create_question(
        db,
        text=question_in.text,
        choices=question_in.choices,
        correct_choice_index=question_in.correct_choice_index,
        image_url=question_in.image_url,
        youtube_url=question_in.youtube_url,
    )
    return [question]


@app.post('/admin/upload-image', response_model=UploadResult)
def upload_image(file: UploadFile = File(...), _: models.User = Depends(get_current_admin)):
    if file.content_type not in {'image/png', 'image/jpeg', 'image/jpg', 'image/gif'}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Image must be PNG, JPEG, or GIF')
    file_name = f'{uuid4().hex}_{file.filename.replace(" ", "_")}'
    destination = UPLOAD_DIR / file_name
    with destination.open('wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    return UploadResult(image_url=f'/uploads/{file_name}')


@app.post('/admin/questions/bulk', response_model=list[QuestionRead])
def bulk_questions(items: list[BulkQuestionItem], db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    questions = crud.bulk_create_questions(db, [item.dict() for item in items])
    return questions


@app.get('/questions', response_model=list[QuestionRead])
def get_questions(db: Session = Depends(get_db), _: models.User = Depends(get_current_user)):
    questions = crud.list_questions(db)
    return questions


@app.post('/questions/{question_id}/answer', response_model=AnswerResult)
def answer_question(question_id: int, answer_in: AnswerCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    question = crud.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Question not found')
    attempt = crud.create_attempt(db, user.id, question_id, answer_in.selected_choice_id)
    if not attempt:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid choice selected')
    correct_choice = next((choice for choice in question.choices if choice.is_correct), None)
    return AnswerResult(
        question_id=question_id,
        selected_choice_id=answer_in.selected_choice_id,
        correct_choice_id=correct_choice.id if correct_choice else None,
        correct=attempt.is_correct,
        message='Correct!' if attempt.is_correct else 'Incorrect.'
    )


@app.get('/score', response_model=ScoreRead)
def get_score(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    total_answered, total_correct, accuracy = crud.compute_score(db, user.id)
    return ScoreRead(total_answered=total_answered, total_correct=total_correct, accuracy=accuracy)
