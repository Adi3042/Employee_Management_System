# setup_admin.py
from utility import get_database
from auth.auth import hash_password
from datetime import datetime

def setup_initial_admin():
    db = get_database()
    
    # Check if admin already exists
    existing_admin = db.users.find_one({'email': 'admin@company.com'})
    
    if existing_admin:
        print("Admin user already exists.")
        return
    
    # Create admin user
    admin_user = {
        'email': 'admin@company.com',
        'name': 'System Administrator',
        'password_hash': hash_password('Admin123!'),
        'role': 'admin',
        'is_verified': True,
        'created_at': datetime.utcnow(),
        'last_login': None,
        'is_active': True,
        'auth_method': 'local'
    }
    
    result = db.users.insert_one(admin_user)
    
    # Create admin employee record
    admin_employee = {
        'user_id': result.inserted_id,
        'name': 'System Administrator',
        'email': 'admin@company.com',
        'role': 'admin',
        'created_at': datetime.utcnow(),
        'manager_id': None
    }
    
    db.employees.insert_one(admin_employee)
    
    print(f"Initial admin user created successfully!")
    print(f"Email: admin@company.com")
    print(f"Password: Admin123!")

if __name__ == "__main__":
    setup_initial_admin()