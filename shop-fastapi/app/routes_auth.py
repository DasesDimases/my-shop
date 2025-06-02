from fastapi import APIRouter, HTTPException
from app.db import db
from app.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter(tags=["auth"])

class AuthData(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register(data: AuthData):
    existing = await db["users"].find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    user_data = {
        "email": data.email,
        "password": hash_password(data.password),
        "is_superuser": False
    }

    await db["users"].insert_one(user_data)
    return {"message": "Пользователь зарегистрирован"}

@router.post("/login")
async def login(data: AuthData):
    user = await db["users"].find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Неверные данные")

    token = create_access_token(
    data={
        "sub": user["email"],
        "is_superuser": user.get("is_superuser", False)
        }
    )
    return {"access_token": token, "token_type": "bearer"}
