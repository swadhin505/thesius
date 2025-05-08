from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from jose import jwt
from dotenv import load_dotenv
import os
from api.models import User
from api.deps import db_dependency, bcrypt_context, user_dependency
from api.repository.search_engine.main import get_query_result
from api.repository.email_verification.email_verification import generate_token, send_verification_email, serializer

load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

# Environment variables
SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))

# Models
class UserCreateRequest(BaseModel):
    username: str
    fullname: str
    email: str
    password: str

class Token(BaseModel):
    auth_token: str
    token_type: str

# Utility functions
async def authenticate_user(email: str, password: str, db):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not bcrypt_context.verify(password, user.hashed_password):
        return None
    return user

async def create_access_token(email: str, user_id: int, expires_delta: timedelta):
    payload = {
        "sub": email,
        "id": user_id,
        "exp": datetime.now(timezone.utc) + expires_delta,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# Routes
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    existing_user = db.query(User).filter(User.email == create_user_request.email).first()
    
    if existing_user:
        return {
            "message": "An account with this email already exists !",
            "status_code": status.HTTP_200_OK
        }

    new_user = User(
        username=create_user_request.username,
        fullname=create_user_request.fullname,
        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.password),
    )
    db.add(new_user)
    db.commit()

    token = generate_token(create_user_request.email)
    await send_verification_email(create_user_request.email, token)

    return {
        "message": "Registration successful. Please check your email(if exists!) for a verification link.",
        "status_code": status.HTTP_201_CREATED,
    }

@router.get("/verify-email")
async def verify_email(token: str, db: db_dependency):
    if os.getenv("NEXTJS_ENV") == 'production':
        frontend_domain = os.getenv("FRONTEND_SERVER", "http://localhost")
    else:
        frontend_domain = "http://localhost"

    try:
        email = serializer.loads(token, salt="email-verification", max_age=3600)
        user = db.query(User).filter(User.email == email).first()

        if not user:
            return {"error": "User not found."}
        
        user.is_verified = True
        db.commit()

        return RedirectResponse(url=f"{frontend_domain}/auth/login", status_code=303)
    except Exception as e:
        return RedirectResponse(url=f"{frontend_domain}/auth/register", status_code=303)

@router.post('/token', response_model=Token)
async def login_for_access_token(
    response: Response, 
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: db_dependency
):
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    if not user.is_verified:
        # Resend verification link
        token = generate_token(user.email)
        await send_verification_email(user.email, token)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your email is not verified. A verification link has been resent to your email.\n Do not forget to check your SPAM folder !"
        )

    token = await create_access_token(user.email, user.id, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    response.set_cookie(key="auth_token", value=token, httponly=True, max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60)

    return {"auth_token": token, "token_type": "bearer"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("auth_token")
    return {"message": "Logged out"}

@router.get("/protected")
async def protected_route(db: db_dependency, current_user: user_dependency):
    user = db.query(User).filter(User.id == current_user["id"]).first()
    return {"userData": user, "message": "Successfully authenticated"}
