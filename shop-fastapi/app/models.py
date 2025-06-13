from pydantic import BaseModel, EmailStr
from typing import List, Optional



class Product(BaseModel):
    name: str
    price: int
    brand: str
    image: Optional[str] = None 
    description: Optional[str] = ""
    code: Optional[str] = ""
    category: Optional[str] = ""
    models: Optional[List[str]] = []

class User(BaseModel):
    id: Optional[str]
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False