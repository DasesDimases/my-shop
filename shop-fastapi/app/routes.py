from fastapi import APIRouter, HTTPException, Body, Depends
from app.models import Product
from app.db import product_collection, db
from bson import ObjectId
from app.auth import get_superuser 
from app.auth import get_current_user

router = APIRouter()

def product_helper(p) -> dict:
    return {
        "id": str(p["_id"]),
        "name": p["name"],
        "brand": p.get("brand", ""),
        "price": p["price"],
        "image": p.get("image", ""),
        "description": p.get("description", ""),
        "code": p.get("code", ""),
        "category": p.get("category", ""),
        "models": p.get("models", [])
    }


@router.get("/products")
async def get_products():
    products = []
    async for p in product_collection.find():
        products.append(product_helper(p))
    return products

@router.get("/orders")
async def get_orders():
    orders = []
    async for order in db["orders"].find().sort("createdAt", -1):
        order["_id"] = str(order["_id"])
        orders.append(order)
    return orders

<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> 4eaa1782 (Auto update)
>>>>>>> 114234a7
@router.post(
    "/products",
    dependencies=[Depends(get_superuser)]
)
async def add_product(product: Product):
    new = await product_collection.insert_one(product.dict())
    inserted = await product_collection.find_one({"_id": new.inserted_id})
    return product_helper(inserted)

@router.put(
    "/products/{product_id}",
    dependencies=[Depends(get_superuser)]
)
async def update_product(
    product_id: str,
    data: dict = Body(...)
):
    try:
        obj_id = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Неверный формат ID")

    result = await product_collection.update_one(
        {"_id": obj_id},
        {"$set": data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Товар не найден")

    updated = await product_collection.find_one({"_id": obj_id})
    return product_helper(updated)

@router.delete(
    "/products/{product_id}",
    dependencies=[Depends(get_superuser)]
)
async def delete_product(product_id: str):
    try:
        obj_id = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Неверный формат ID")

    result = await product_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return {"success": True}

@router.post("/orders")
async def create_order(order: dict = Body(...), user: dict = Depends(get_current_user)):
    result = await db["orders"].insert_one(order)
    return {"success": True, "order_id": str(result.inserted_id)}

@router.delete(
    "/orders/{order_id}",
    dependencies=[Depends(get_superuser)]
)
async def delete_order(order_id: str):
    try:
        obj_id = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Неверный формат ID")

    result = await db["orders"].delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return {"success": True}

@router.get("/customers/clusters")
async def get_customer_clusters():
    clusters = []
    async for doc in db["customer_clusters"].find():
        doc["_id"] = str(doc["_id"])
        clusters.append(doc)
    return clusters

