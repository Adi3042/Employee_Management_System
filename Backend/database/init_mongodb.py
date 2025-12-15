import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGODB_DB", "employee_management")

if not MONGO_URI:
    raise ValueError("❌ MONGO_URI not found. Check your .env file!")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections to create
collections_to_create = [
    "users",
    "employees",
    "projects",
    "project_assignments",
    "messages",
    "admins",
    "managers"
]

existing_collections = db.list_collection_names()

# Create missing collections
for collection_name in collections_to_create:
    if collection_name not in existing_collections:
        db.create_collection(collection_name)
        print(f"✅ Created collection: {collection_name}")
    else:
        print(f"✔️ Collection already exists: {collection_name}")

# Create indexes (safe even if they already exist)
db.users.create_index("email", unique=True)
db.users.create_index("google_id", unique=True, sparse=True)

db.employees.create_index("email", unique=True)
db.employees.create_index("user_id", unique=True)

db.projects.create_index("title")

db.messages.create_index([("sender_id", 1), ("receiver_id", 1)])
db.messages.create_index("timestamp")

print("🎉 MongoDB initialized successfully!")
