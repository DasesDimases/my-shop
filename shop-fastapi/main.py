from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.routes_analytics import router as analytics_router
from app.db import db
from app.auth import SECRET_KEY, ALGORITHM
from app.routes import router as products_router
from app.routes_extras import router as extras_router
from app.routes_auth import router as auth_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.renault-lada36.ru", "https://renault-lada36.ru"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Неверный токен")

    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    return user

async def get_superuser(user: dict = Depends(get_current_user)):
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    return user


app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(products_router, tags=["products", "orders"])
app.include_router(extras_router, tags=["extras"])
app.include_router(analytics_router, tags=["analytics"])