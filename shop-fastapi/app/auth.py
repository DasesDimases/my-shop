import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.db import db

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(
    *,
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Генерирует JWT, добавляя в payload поля из data + exp.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Декодирует JWT из заголовка Authorization, возвращает запись пользователя из БД.
    Бросает 401, если токен недействителен или пользователь не найден.
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await db["users"].find_one({"email": email})
    if not user:
        raise credentials_exception
    return user

async def get_superuser(user: dict = Depends(get_current_user)):
    """
    Проверяет, что текущий пользователь — суперпользователь.
    Бросает 403, если нет прав.
    """
    if not user.get("is_superuser", False):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user

