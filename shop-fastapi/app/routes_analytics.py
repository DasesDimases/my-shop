from fastapi import APIRouter
from app.db import db
from sklearn.cluster import KMeans
import numpy as np
from collections import defaultdict
from datetime import datetime
from datetime import timezone
from dateutil.parser import parse as parse_date

router = APIRouter(prefix="/analytics")


@router.post("/customers/clusters")
async def cluster_customers():
    orders = db["orders"]
    customer_data = {}

    async for order in orders.find():
        email = order["customer"]["email"]
        total = order.get("total", 0)

        if email not in customer_data:
            customer_data[email] = {
                "email": email,
                "total": 0,
                "ordersCount": 0,
                "name": order["customer"].get("name", ""),
                "phone": order["customer"].get("phone", "")
            }

        customer_data[email]["total"] += total
        customer_data[email]["ordersCount"] += 1

    customers = list(customer_data.values())

    if len(customers) < 2:
        return {"message": "Недостаточно данных для кластеризации", "clusters": []}

    X = np.array([[c["total"], c["ordersCount"]] for c in customers])
    kmeans = KMeans(n_clusters=3, random_state=0).fit(X)
    labels = kmeans.labels_

    for i, label in enumerate(labels):
        customers[i]["cluster"] = int(label)

    await db["customer_clusters"].delete_many({})
    await db["customer_clusters"].insert_many(customers)

    for c in customers:
        c.pop("_id", None)

    return {"message": "Кластеры сохранены", "clusters": customers}


@router.get("/customers/clusters")
async def get_customer_clusters():
    clusters = []
    async for doc in db["customer_clusters"].find():
        doc["_id"] = str(doc["_id"])
        clusters.append(doc)
    return clusters


@router.post("/customers/clusters/categories")
async def cluster_customers_categories():
    orders_cursor = db["orders"].find()
    category_set = set()
    customer_vectors = {}

    async for order in orders_cursor:
        for item in order.get("items", []):
            category = item.get("category", "")
            if category:
                category_set.add(category)

    categories = sorted(category_set)
    category_indices = {cat: i for i, cat in enumerate(categories)}

    orders_cursor = db["orders"].find()
    async for order in orders_cursor:
        email = order["customer"]["email"]
        if email not in customer_vectors:
            customer_vectors[email] = {
                "vector": [0] * len(categories),
                "email": email,
                "name": order["customer"].get("name", ""),
                "phone": order["customer"].get("phone", "")
            }

        for item in order.get("items", []):
            cat = item.get("category", "")
            if cat in category_indices:
                idx = category_indices[cat]
                customer_vectors[email]["vector"][idx] += item.get("qty", 1)

    for customer in customer_vectors.values():
        vector = customer["vector"]
        top_categories = sorted(
            [(categories[i], count) for i, count in enumerate(vector)],
            key=lambda x: -x[1]
        )[:3]
        customer["top_categories"] = [name for name, _ in top_categories]

    customers = list(customer_vectors.values())

    if len(customers) < 2:
        return {"message": "Недостаточно данных для кластеризации", "clusters": []}

    X = np.array([c["vector"] for c in customers])
    kmeans = KMeans(n_clusters=3, random_state=0).fit(X)
    labels = kmeans.labels_

    for i, label in enumerate(labels):
        customers[i]["cluster"] = int(label)
        del customers[i]["vector"]

    await db["customer_category_clusters"].delete_many({})
    await db["customer_category_clusters"].insert_many(customers)

    for c in customers:
        c.pop("_id", None)

    return {"message": "Кластеры по категориям сохранены", "clusters": customers}


@router.get("/customers/clusters/categories")
async def get_customer_clusters_categories():
    clusters = []
    async for doc in db["customer_category_clusters"].find():
        doc["_id"] = str(doc["_id"])
        clusters.append(doc)
    return clusters


@router.post("/customers/clusters/models")
async def cluster_customers_models():
    orders_cursor = db["orders"].find()
    model_set = set()
    customer_vectors = {}

    async for order in orders_cursor:
        for item in order.get("items", []):
            for model in item.get("models", []):
                model_set.add(model)

    models = sorted(model_set)
    model_indices = {model: i for i, model in enumerate(models)}

    orders_cursor = db["orders"].find()
    async for order in orders_cursor:
        email = order["customer"]["email"]
        if email not in customer_vectors:
            customer_vectors[email] = {
                "vector": [0] * len(models),
                "email": email,
                "name": order["customer"].get("name", ""),
                "phone": order["customer"].get("phone", "")
            }

        for item in order.get("items", []):
            for model in item.get("models", []):
                idx = model_indices.get(model)
                if idx is not None:
                    customer_vectors[email]["vector"][idx] += item.get("qty", 1)

    for customer in customer_vectors.values():
        vector = customer["vector"]
        top_models = sorted(
            [(models[i], count) for i, count in enumerate(vector)],
            key=lambda x: -x[1]
        )[:3]
        customer["top_models"] = [name for name, _ in top_models]

    customers = list(customer_vectors.values())

    if len(customers) < 2:
        return {"message": "Недостаточно данных для кластеризации", "clusters": []}

    X = np.array([c["vector"] for c in customers])
    kmeans = KMeans(n_clusters=3, random_state=0).fit(X)
    labels = kmeans.labels_

    for i, label in enumerate(labels):
        customers[i]["cluster"] = int(label)
        del customers[i]["vector"]

    await db["customer_model_clusters"].delete_many({})
    await db["customer_model_clusters"].insert_many(customers)

    for c in customers:
        c.pop("_id", None)

    return {"message": "Кластеры по моделям сохранены", "clusters": customers}


@router.get("/customers/clusters/models")
async def get_customer_clusters_models():
    clusters = []
    async for doc in db["customer_model_clusters"].find():
        doc["_id"] = str(doc["_id"])
        clusters.append(doc)
    return clusters

@router.get("/categories/popularity")
async def get_category_popularity():
    orders_cursor = db["orders"].find()
    category_counts = defaultdict(int)

    async for order in orders_cursor:
        for item in order.get("items", []):
            category = item.get("category")
            if category:
                category_counts[category] += item.get("qty", 1)

    return [{"category": k, "count": v} for k, v in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)]

@router.get("/models/popularity")
async def get_model_popularity():
    orders_cursor = db["orders"].find()
    model_counts = defaultdict(int)

    async for order in orders_cursor:
        for item in order.get("items", []):
            for model in item.get("models", []):
                model_counts[model] += item.get("qty", 1)

    return [{"model": k, "count": v} for k, v in sorted(model_counts.items(), key=lambda x: x[1], reverse=True)]

@router.post("/customers/clusters/rfm")
async def cluster_customers_rfm():
    orders = db["orders"]
    customer_data = {}
    now = datetime.utcnow().replace(tzinfo=None)

    async for order in orders.find():
        email = order["customer"]["email"]
        total = order.get("total", 0)
        date = order.get("createdAt")

        if isinstance(date, str):
            try:
                date = parse_date(date)
            except Exception as e:
                print(f"Ошибка разбора даты: {e}")
                continue

        if date.tzinfo is not None:
            date = date.astimezone(timezone.utc).replace(tzinfo=None) 

        if not date:
            continue

        if email not in customer_data:
            customer_data[email] = {
                "email": email,
                "total": 0,
                "ordersCount": 0,
                "lastOrder": date,
                "name": order["customer"].get("name", ""),
                "phone": order["customer"].get("phone", "")
            }

        customer_data[email]["total"] += total
        customer_data[email]["ordersCount"] += 1
        if not customer_data[email]["lastOrder"] or date > customer_data[email]["lastOrder"]:
            customer_data[email]["lastOrder"] = date

    customers = []
    for c in customer_data.values():
        if not c["lastOrder"]:
            continue
        recency = round((now - c["lastOrder"]).total_seconds() / 86400, 2)
        print(f"{c['email']} → lastOrder: {c['lastOrder']} → recency: {recency}")
        customers.append({
            "email": c["email"],
            "name": c["name"],
            "phone": c["phone"],
            "recency": recency,
            "frequency": c["ordersCount"],
            "monetary": c["total"]
        })

    if len(customers) < 2:
        return {"message": "Недостаточно данных для RFM-кластеризации", "clusters": []}

    X = np.array([[c["recency"], c["frequency"], c["monetary"]] for c in customers])
    kmeans = KMeans(n_clusters=3, random_state=0).fit(X)
    labels = kmeans.labels_

    for i, label in enumerate(labels):
        customers[i]["cluster"] = int(label)

    cluster_stats = defaultdict(lambda: {"count": 0, "recency": 0, "frequency": 0, "monetary": 0})
    for c in customers:
        cl = c["cluster"]
        cluster_stats[cl]["count"] += 1
        cluster_stats[cl]["recency"] += c["recency"]
        cluster_stats[cl]["frequency"] += c["frequency"]
        cluster_stats[cl]["monetary"] += c["monetary"]

    for cl in cluster_stats:
        stats = cluster_stats[cl]
        count = stats["count"]
        stats["avg_recency"] = round(stats["recency"] / count, 2)
        stats["avg_frequency"] = round(stats["frequency"] / count, 2)
        stats["avg_monetary"] = round(stats["monetary"] / count, 2)

    await db["customer_rfm_clusters"].delete_many({})
    await db["customer_rfm_clusters"].insert_many(customers)

    for c in customers:
        c.pop("_id", None)

    return {
        "message": "RFM-кластеры сохранены",
        "clusters": customers,
        "cluster_summary": cluster_stats
    }

@router.get("/customers/clusters/rfm")
async def get_customer_rfm_clusters():
    clusters = []
    async for doc in db["customer_rfm_clusters"].find():
        doc["_id"] = str(doc["_id"])
        clusters.append(doc)
    return clusters

@router.get("/customers/clusters/rfm/summary")
async def summarize_rfm_clusters():
    clusters = await db["customer_rfm_clusters"].find().to_list(None)

    if not clusters:
        return {"message": "Нет данных"}

    summary = {}
    for c in clusters:
        cluster = c["cluster"]
        if cluster not in summary:
            summary[cluster] = {
                "count": 0,
                "total_recency": 0,
                "total_frequency": 0,
                "total_monetary": 0,
                "customers": []
            }
        summary[cluster]["count"] += 1
        summary[cluster]["total_recency"] += c["recency"]
        summary[cluster]["total_frequency"] += c["frequency"]
        summary[cluster]["total_monetary"] += c["monetary"]
        summary[cluster]["customers"].append(c)

    result = []
    for cluster, data in summary.items():
        avg_recency = data["total_recency"] / data["count"]
        avg_frequency = data["total_frequency"] / data["count"]
        avg_monetary = data["total_monetary"] / data["count"]

        result.append({
            "cluster": cluster,
            "avg_recency": round(avg_recency, 1),
            "avg_frequency": round(avg_frequency, 1),
            "avg_monetary": round(avg_monetary, 1),
            "count": data["count"]
        })

    monetaries = [r["avg_monetary"] for r in result]
    max_monetary = max(monetaries)
    min_monetary = min(monetaries)

    for r in result:
        if r["avg_monetary"] == max_monetary:
            r["label"] = "Ценный клиент"
        elif r["avg_monetary"] == min_monetary:
            r["label"] = "Клиент на грани ухода"
        else:
            r["label"] = "Постоянный клиент"

    return result

