import os
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, session, current_app
import jwt
from bson import ObjectId  # ADD THIS IMPORT
from utility import get_database, validate_email, validate_password, hash_password, verify_password, generate_verification_token
from logger import get_logger

logger = get_logger(__name__)

def init_auth(app):
    """Initialize authentication with Flask app."""
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', secrets.token_hex(32))
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

def generate_tokens(user_id, email, role):
    """Generate JWT tokens."""
    try:
        access_token = jwt.encode({
            'user_id': str(user_id),
            'email': email,
            'role': role,
            'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        refresh_token = jwt.encode({
            'user_id': str(user_id),
            'exp': datetime.utcnow() + current_app.config['JWT_REFRESH_TOKEN_EXPIRES']
        }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'bearer',
            'expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds()
        }
    except Exception as e:
        logger.error(f"Token generation failed: {str(e)}")
        raise
    
def verify_token(token):
    """Verify JWT token."""
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {str(e)}")
        return None

def token_required(f):
    """Decorator to protect routes with JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            payload = verify_token(token)
            if not payload:
                return jsonify({'message': 'Token is invalid or expired!'}), 401
            
            # Store user info in request context
            request.user_id = ObjectId(payload['user_id'])  # Convert to ObjectId
            request.user_email = payload['email']
            request.user_role = payload['role']
            
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(*args, **kwargs)
    return decorated

def register_user(email, password, name=None, role='employee'):
    """Register a new user with email/password."""
    try:
        db = get_database()
        users_collection = db.users
        
        # Validate email
        if not validate_email(email):
            return {'error': 'Invalid email format'}, 400
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return {'error': 'User already exists'}, 400
        
        # Validate password
        if not validate_password(password):
            return {'error': 'Password must be at least 8 characters with letters and numbers'}, 400
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Generate verification token
        verification_token = generate_verification_token()
        
        # Create user document
        user_doc = {
            'email': email,
            'name': name,
            'password_hash': hashed_password,
            'role': role,
            # 'is_verified': False,
            'is_verified' : True,
            'verification_token': verification_token,
            'created_at': datetime.utcnow(),
            'last_login': None,
            'is_active': True,
            'auth_method': 'local'  # 'local' or 'google'
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        user_doc['_id'] = result.inserted_id
        
        # Create employee profile if needed
        if role == 'employee' or role == 'manager':
            employees_collection = db.employees
            employee_doc = {
                'user_id': result.inserted_id,
                'name': name,
                'email': email,
                'role': role,
                'created_at': datetime.utcnow(),
                'manager_id': None
            }
            employees_collection.insert_one(employee_doc)
        
        return {
            'message': 'User registered successfully. Please verify your email.',
            'user_id': str(result.inserted_id),
            'verification_token': verification_token
        }, 201
        
    except Exception as e:
        logger.error(f"User registration failed: {str(e)}", exc_info=True)
        return {'error': 'Registration failed'}, 500

def login_user(email, password):
    """Login user with email and password."""
    try:
        db = get_database()
        users_collection = db.users
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return {'error': 'Invalid credentials'}, 401
        
        # Check if user is active
        if not user.get('is_active', True):
            return {'error': 'Account is deactivated'}, 401
        
        # Check auth method
        if user.get('auth_method') == 'google':
            return {'error': 'Please use Google Sign-In for this account'}, 400
        
        # Verify password
        if not verify_password(password, user['password_hash']):
            return {'error': 'Invalid credentials'}, 401
        
        # Check if email is verified
        if not user.get('is_verified', False):
            return {'error': 'Please verify your email first'}, 403
        
        # Update last login
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'last_login': datetime.utcnow()}}
        )
        
        # Generate tokens
        tokens = generate_tokens(str(user['_id']), user['email'], user['role'])
        
        return {
            'message': 'Login successful',
            'tokens': tokens,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name'),
                'role': user['role']
            }
        }, 200
        
    except Exception as e:
        logger.error(f"Login failed: {str(e)}", exc_info=True)
        return {'error': 'Login failed'}, 500

def verify_email(token):
    """Verify user email with token."""
    try:
        db = get_database()
        users_collection = db.users
        
        # Find user by verification token
        user = users_collection.find_one({'verification_token': token})
        if not user:
            return {'error': 'Invalid verification token'}, 400
        
        # Update user as verified
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {
                'is_verified': True,
                'verification_token': None
            }}
        )
        
        return {'message': 'Email verified successfully'}, 200
        
    except Exception as e:
        logger.error(f"Email verification failed: {str(e)}", exc_info=True)
        return {'error': 'Verification failed'}, 500

def google_auth_callback(user_info):
    """Handle Google OAuth callback."""
    try:
        db = get_database()
        users_collection = db.users
        
        email = user_info['email']
        
        # Check if user exists
        user = users_collection.find_one({'email': email})
        
        if not user:
            # Create new user
            user_doc = {
                'email': email,
                'name': user_info.get('name'),
                'google_id': user_info.get('sub'),
                'picture': user_info.get('picture'),
                'role': 'employee',  # Default role
                'is_verified': True,  # Google emails are verified
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow(),
                'is_active': True,
                'auth_method': 'google'
            }
            
            result = users_collection.insert_one(user_doc)
            user_id = result.inserted_id
            
        else:
            # Update existing user
            users_collection.update_one(
                {'_id': user['_id']},
                {'$set': {
                    'last_login': datetime.utcnow(),
                    'name': user_info.get('name', user.get('name')),
                    'picture': user_info.get('picture', user.get('picture'))
                }}
            )
            user_id = user['_id']
        
        # Generate tokens
        user = users_collection.find_one({'_id': user_id})
        tokens = generate_tokens(str(user_id), user['email'], user['role'])
        
        # Ensure consistent response format
        response_data = {
            'message': 'Google authentication successful',
            'tokens': tokens,
            'user': {
                'id': str(user_id),
                'email': user['email'],
                'name': user.get('name'),
                'role': user.get('role'),
                'picture': user.get('picture')
            }
        }
        
        return response_data, 200
        
    except Exception as e:
        logger.error(f"Google auth failed: {str(e)}", exc_info=True)
        return {'error': 'Google authentication failed'}, 500
    
# Add these functions to your auth.py

def create_user_by_admin(email, password, name, role, created_by_admin_id):
    """Admin creates a new user (employee or manager)."""
    try:
        db = get_database()
        users_collection = db.users
        
        # Check if admin exists
        admin = users_collection.find_one({'_id': ObjectId(created_by_admin_id), 'role': 'admin'})
        if not admin:
            return {'error': 'Only admins can create users'}, 403
        
        # Validate email
        if not validate_email(email):
            return {'error': 'Invalid email format'}, 400
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return {'error': 'User already exists'}, 400
        
        # Validate password
        if not validate_password(password):
            return {'error': 'Password must be at least 8 characters with letters and numbers'}, 400
        
        # Validate role
        if role not in ['employee', 'manager', 'admin']:
            return {'error': 'Invalid role'}, 400
        
        # Only admin can create other admins
        if role == 'admin' and request.user_role != 'admin':
            return {'error': 'Only admins can create other admins'}, 403
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Create user document
        user_doc = {
            'email': email,
            'name': name,
            'password_hash': hashed_password,
            'role': role,
            'is_verified': True,
            'created_by': ObjectId(created_by_admin_id),
            'created_at': datetime.utcnow(),
            'last_login': None,
            'is_active': True,
            'auth_method': 'local'
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        user_doc['_id'] = result.inserted_id
        
        # Create employee/manager profile
        if role in ['employee', 'manager']:
            employees_collection = db.employees
            employee_doc = {
                'user_id': result.inserted_id,
                'name': name,
                'email': email,
                'role': role,
                'created_by': ObjectId(created_by_admin_id),
                'created_at': datetime.utcnow(),
                'manager_id': None
            }
            employees_collection.insert_one(employee_doc)
            
            # If creating a manager, update managers collection
            if role == 'manager':
                managers_collection = db.managers
                manager_doc = {
                    'user_id': result.inserted_id,
                    'name': name,
                    'email': email,
                    'created_at': datetime.utcnow(),
                    'team_members': []
                }
                managers_collection.insert_one(manager_doc)
        
        return {
            'message': f'User created successfully as {role}',
            'user_id': str(result.inserted_id)
        }, 201
        
    except Exception as e:
        logger.error(f"User creation failed: {str(e)}")
        return {'error': 'User creation failed'}, 500

def create_user_by_manager(email, password, name, created_by_manager_id):
    """Manager creates a new employee (only employees)."""
    try:
        db = get_database()
        users_collection = db.users
        
        # Check if manager exists
        manager = users_collection.find_one({'_id': ObjectId(created_by_manager_id), 'role': 'manager'})
        if not manager:
            return {'error': 'Only managers can create employees'}, 403
        
        # Validate email
        if not validate_email(email):
            return {'error': 'Invalid email format'}, 400
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return {'error': 'User already exists'}, 400
        
        # Validate password
        if not validate_password(password):
            return {'error': 'Password must be at least 8 characters with letters and numbers'}, 400
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Create user document (always employee when created by manager)
        user_doc = {
            'email': email,
            'name': name,
            'password_hash': hashed_password,
            'role': 'employee',
            'is_verified': True,
            'created_by': ObjectId(created_by_manager_id),
            'created_at': datetime.utcnow(),
            'last_login': None,
            'is_active': True,
            'auth_method': 'local'
        }
        
        # Insert user
        result = users_collection.insert_one(user_doc)
        user_doc['_id'] = result.inserted_id
        
        # Create employee profile
        employees_collection = db.employees
        employee_doc = {
            'user_id': result.inserted_id,
            'name': name,
            'email': email,
            'role': 'employee',
            'created_by': ObjectId(created_by_manager_id),
            'created_at': datetime.utcnow(),
            'manager_id': ObjectId(created_by_manager_id)  # Auto-assign to creating manager
        }
        employees_collection.insert_one(employee_doc)
        
        # Update manager's team members
        managers_collection = db.managers
        managers_collection.update_one(
            {'user_id': ObjectId(created_by_manager_id)},
            {'$push': {'team_members': result.inserted_id}}
        )
        
        return {
            'message': 'Employee created successfully',
            'user_id': str(result.inserted_id)
        }, 201
        
    except Exception as e:
        logger.error(f"Employee creation failed: {str(e)}")
        return {'error': 'Employee creation failed'}, 500

def delete_user(user_id, deleted_by_id):
    """Delete/Deactivate a user."""
    try:
        db = get_database()
        users_collection = db.users
        
        # Get user to delete
        user_to_delete = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user_to_delete:
            return {'error': 'User not found'}, 404
        
        # Get deleter user
        deleter = users_collection.find_one({'_id': ObjectId(deleted_by_id)})
        
        # Check permissions
        if deleter['role'] == 'employee':
            return {'error': 'Employees cannot delete users'}, 403
        
        # Managers can only delete their own employees
        if deleter['role'] == 'manager':
            if user_to_delete['role'] != 'employee':
                return {'error': 'Managers can only delete employees'}, 403
            
            # Check if employee is under this manager
            employees_collection = db.employees
            employee = employees_collection.find_one({
                'user_id': ObjectId(user_id),
                'manager_id': ObjectId(deleted_by_id)
            })
            if not employee:
                return {'error': 'You can only delete employees in your team'}, 403
        
        # If deleting a manager, handle team reassignment
        if user_to_delete['role'] == 'manager':
            return handle_manager_deletion(user_to_delete, deleter)
        
        # Soft delete - deactivate user
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'is_active': False, 'deleted_at': datetime.utcnow()}}
        )
        
        # Also deactivate employee record
        employees_collection = db.employees
        employees_collection.update_one(
            {'user_id': ObjectId(user_id)},
            {'$set': {'is_active': False}}
        )
        
        return {'message': 'User deactivated successfully'}, 200
        
    except Exception as e:
        logger.error(f"User deletion failed: {str(e)}")
        return {'error': 'User deletion failed'}, 500

def handle_manager_deletion(manager_to_delete, deleter):
    """Handle manager deletion with team reassignment."""
    try:
        db = get_database()
        
        # Get all employees under this manager
        employees_collection = db.employees
        employees = list(employees_collection.find({
            'manager_id': manager_to_delete['_id'],
            'is_active': True
        }))
        
        if not employees:
            # No employees, just delete the manager
            db.users.update_one(
                {'_id': manager_to_delete['_id']},
                {'$set': {'is_active': False, 'deleted_at': datetime.utcnow()}}
            )
            return {'message': 'Manager deactivated successfully'}, 200
        
        # Return special response indicating team needs reassignment
        return {
            'message': 'Manager has active team members',
            'requires_reassignment': True,
            'manager_id': str(manager_to_delete['_id']),
            'team_size': len(employees),
            'employee_ids': [str(emp['user_id']) for emp in employees]
        }, 200
        
    except Exception as e:
        logger.error(f"Manager deletion handling failed: {str(e)}")
        raise

def reassign_team(manager_id, new_manager_id=None, action='reassign'):
    """Reassign a manager's team to another manager or make them managers."""
    try:
        db = get_database()
        employees_collection = db.employees
        
        if action == 'reassign' and new_manager_id:
            # Reassign to existing manager
            new_manager = db.users.find_one({'_id': ObjectId(new_manager_id), 'role': 'manager'})
            if not new_manager:
                return {'error': 'New manager not found'}, 404
            
            # Update all employees
            employees_collection.update_many(
                {'manager_id': ObjectId(manager_id)},
                {'$set': {'manager_id': ObjectId(new_manager_id)}}
            )
            
            # Update manager's team in managers collection
            db.managers.update_one(
                {'user_id': ObjectId(new_manager_id)},
                {'$push': {'team_members': {'$each': [emp['user_id'] for emp in employees_collection.find({'manager_id': ObjectId(manager_id)})]}}}
            )
            
            # Deactivate old manager
            db.users.update_one(
                {'_id': ObjectId(manager_id)},
                {'$set': {'is_active': False, 'deleted_at': datetime.utcnow()}}
            )
            
            return {'message': f'Team reassigned to {new_manager["name"]}'}, 200
            
        elif action == 'promote':
            # Promote an employee from the team to manager
            # This would require selecting which employee to promote
            # Implementation depends on your UI flow
            pass
            
    except Exception as e:
        logger.error(f"Team reassignment failed: {str(e)}")
        return {'error': 'Team reassignment failed'}, 500

def change_employee_manager(employee_id, new_manager_id, changed_by_id):
    """Change an employee's manager."""
    try:
        db = get_database()
        
        # Check permissions
        changer = db.users.find_one({'_id': ObjectId(changed_by_id)})
        if changer['role'] not in ['admin', 'manager']:
            return {'error': 'Insufficient permissions'}, 403
        
        # If changer is manager, check if they're changing their own employee
        if changer['role'] == 'manager':
            employee = db.employees.find_one({'user_id': ObjectId(employee_id)})
            if employee['manager_id'] != changer['_id']:
                return {'error': 'You can only change manager for employees in your team'}, 403
        
        # Check if new manager exists and is a manager
        new_manager = db.users.find_one({'_id': ObjectId(new_manager_id), 'role': 'manager'})
        if not new_manager:
            return {'error': 'New manager not found or not a manager'}, 404
        
        # Update employee's manager
        db.employees.update_one(
            {'user_id': ObjectId(employee_id)},
            {'$set': {'manager_id': ObjectId(new_manager_id)}}
        )
        
        # Update managers' team lists
        # Remove from old manager's team
        old_employee = db.employees.find_one({'user_id': ObjectId(employee_id)})
        if old_employee.get('manager_id'):
            db.managers.update_one(
                {'user_id': old_employee['manager_id']},
                {'$pull': {'team_members': ObjectId(employee_id)}}
            )
        
        # Add to new manager's team
        db.managers.update_one(
            {'user_id': ObjectId(new_manager_id)},
            {'$push': {'team_members': ObjectId(employee_id)}}
        )
        
        return {'message': 'Employee manager changed successfully'}, 200
        
    except Exception as e:
        logger.error(f"Manager change failed: {str(e)}")
        return {'error': 'Manager change failed'}, 500

def assign_project_to_employee(project_id, employee_id, assigned_by_id):
    """Assign a project to an employee."""
    try:
        db = get_database()
        
        # Check permissions
        assigner = db.users.find_one({'_id': ObjectId(assigned_by_id)})
        if assigner['role'] not in ['admin', 'manager']:
            return {'error': 'Insufficient permissions'}, 403
        
        # If assigner is manager, check if employee is in their team
        if assigner['role'] == 'manager':
            employee = db.employees.find_one({'user_id': ObjectId(employee_id)})
            if not employee or employee['manager_id'] != assigner['_id']:
                return {'error': 'You can only assign projects to employees in your team'}, 403
        
        # Check if project exists
        project = db.projects.find_one({'_id': ObjectId(project_id)})
        if not project:
            return {'error': 'Project not found'}, 404
        
        # Check if employee exists and is active
        employee_user = db.users.find_one({'_id': ObjectId(employee_id), 'is_active': True})
        if not employee_user:
            return {'error': 'Employee not found or inactive'}, 404
        
        # Check if already assigned
        existing_assignment = db.project_assignments.find_one({
            'project_id': ObjectId(project_id),
            'employee_id': ObjectId(employee_id)
        })
        if existing_assignment:
            return {'error': 'Employee already assigned to this project'}, 400
        
        # Create assignment
        assignment_doc = {
            'project_id': ObjectId(project_id),
            'employee_id': ObjectId(employee_id),
            'assigned_by': ObjectId(assigned_by_id),
            'assigned_at': datetime.utcnow(),
            'progress': 0,
            'status': 'assigned'
        }
        
        db.project_assignments.insert_one(assignment_doc)
        
        return {'message': 'Project assigned successfully'}, 200
        
    except Exception as e:
        logger.error(f"Project assignment failed: {str(e)}")
        return {'error': 'Project assignment failed'}, 500