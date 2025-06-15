from fastapi import APIRouter, HTTPException
from app.db import db
from app.models import User
from bson import ObjectId
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter()


@router.get("/categories")
async def get_categories():
    items = []
    async for cat in db["categories"].find():
        items.append({"id": str(cat["_id"]), "name": cat["name"]})
    return items

@router.post("/categories")
async def add_category(data: dict):
    if "name" not in data:
        raise HTTPException(status_code=400, detail="Название обязательно")
    result = await db["categories"].insert_one({"name": data["name"]})
    return {"id": str(result.inserted_id), "name": data["name"]}

@router.delete("/categories/{cat_id}")
async def delete_category(cat_id: str):
    result = await db["categories"].delete_one({"_id": ObjectId(cat_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return {"success": True}


@router.get("/car-models")
async def get_car_models():
    items = []
    async for m in db["car_models"].find():
        items.append({"id": str(m["_id"]), "name": m["name"]})
    return items

@router.post("/car-models")
async def add_car_model(data: dict):
    if "name" not in data:
        raise HTTPException(status_code=400, detail="Название обязательно")
    result = await db["car_models"].insert_one({"name": data["name"]})
    return {"id": str(result.inserted_id), "name": data["name"]}

@router.delete("/car-models/{model_id}")
async def delete_car_model(model_id: str):
    result = await db["car_models"].delete_one({"_id": ObjectId(model_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Модель не найдена")
    return {"success": True}


@router.get("/meta")
async def get_meta():
    categories = []
    carModels = []
    async for c in db["categories"].find():
        categories.append({"id": str(c["_id"]), "name": c["name"]})
    async for m in db["car_models"].find():
        carModels.append({"id": str(m["_id"]), "name": m["name"]})
    return {"categories": categories, "carModels": carModels}
