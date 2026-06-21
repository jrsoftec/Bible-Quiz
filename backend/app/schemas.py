from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl


class Token(BaseModel):
    access_token: str
    token_type: str
    email: EmailStr
    is_admin: bool


class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    is_admin: bool

    class Config:
        orm_mode = True


class ChoiceRead(BaseModel):
    id: int
    text: str

    class Config:
        orm_mode = True


class QuestionRead(BaseModel):
    id: int
    text: str
    image_url: Optional[str]
    youtube_url: Optional[str]
    choices: List[ChoiceRead]

    class Config:
        orm_mode = True


class AnswerCreate(BaseModel):
    selected_choice_id: int


class AnswerResult(BaseModel):
    question_id: int
    selected_choice_id: int
    correct_choice_id: Optional[int]
    correct: bool
    message: str


class BulkQuestionItem(BaseModel):
    text: str
    choices: List[str]
    correct_choice_index: int
    youtube_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None


class UploadResult(BaseModel):
    image_url: str


class ScoreRead(BaseModel):
    total_answered: int
    total_correct: int
    accuracy: float


class QuestionCreateForm(BaseModel):
    text: str
    choices: List[str]
    correct_choice_index: int
    youtube_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
