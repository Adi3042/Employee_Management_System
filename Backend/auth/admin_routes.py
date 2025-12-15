from flask import Blueprint, request, jsonify
from bson import ObjectId
from logger import get_logger
from utility import get_database, get_logger
from auth.auth import (
    token_required, create_user_by_admin, create_user_by_manager,
    delete_user, reassign_team, change_employee_manager, assign_project_to_employee
)
from auth.permission import admin_required, manager_or_admin_required

logger = get_logger(__name__)

admin_bp = Blueprint('admin', __name__, url_prefix='/xapi/admin')

@admin_bp.route('/users', methods=['POST'])
@token_required
@admin_required
def create_user():
    """Admin creates a new user (employee, manager, or admin)."""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'employee')
        
        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        response, status = create_user_by_admin(
            email=email,
            password=password,
            name=name,
            role=role,
            created_by_admin_id=request.user_id
        )
        return jsonify(response), status
        
    except Exception as e:
        logger.error(f"Admin user creation error: {str(e)}")
        return jsonify({'error': 'User creation failed'}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user_route(user_id):
    """Admin deletes a user."""
    try:
        response, status = delete_user(user_id, str(request.user_id))
        return jsonify(response), status
    except Exception as e:
        logger.error(f"User deletion error: {str(e)}")
        return jsonify({'error': 'User deletion failed'}), 500

@admin_bp.route('/managers/<manager_id>/reassign-team', methods=['POST'])
@token_required
@admin_required
def reassign_manager_team(manager_id):
    """Reassign a manager's team when deleting the manager."""
    try:
        data = request.json
        new_manager_id = data.get('new_manager_id')
        action = data.get('action', 'reassign')
        
        response, status = reassign_team(manager_id, new_manager_id, action)
        return jsonify(response), status
    except Exception as e:
        logger.error(f"Team reassignment error: {str(e)}")
        return jsonify({'error': 'Team reassignment failed'}), 500

@admin_bp.route('/users/stats', methods=['GET'])
@token_required
@admin_required
def get_user_stats():
    """Get user statistics for admin dashboard."""
    try:
        db = get_database()
        
        stats = {
            'total_users': db.users.count_documents({}),
            'active_users': db.users.count_documents({'is_active': True}),
            'employees': db.users.count_documents({'role': 'employee', 'is_active': True}),
            'managers': db.users.count_documents({'role': 'manager', 'is_active': True}),
            'admins': db.users.count_documents({'role': 'admin', 'is_active': True}),
            'inactive_users': db.users.count_documents({'is_active': False})
        }
        
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Stats fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch stats'}), 500

@admin_bp.route('/users/list', methods=['GET'])
@token_required
@admin_required
def list_all_users():
    """List all users with details (admin only)."""
    try:
        db = get_database()
        
        users = list(db.users.find({}))
        result = []
        
        for user in users:
            user_data = {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name'),
                'role': user.get('role'),
                'is_active': user.get('is_active', True),
                'created_at': user.get('created_at'),
                'last_login': user.get('last_login'),
                'auth_method': user.get('auth_method')
            }
            
            # Add manager info for employees
            if user['role'] == 'employee':
                employee = db.employees.find_one({'user_id': user['_id']})
                if employee and employee.get('manager_id'):
                    manager = db.users.find_one({'_id': employee['manager_id']})
                    user_data['manager_name'] = manager['name'] if manager else None
                    user_data['manager_id'] = str(employee['manager_id'])
            
            result.append(user_data)
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"User list error: {str(e)}")
        return jsonify({'error': 'Failed to fetch users'}), 500
    
# Add these routes to admin_routes.py

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@token_required
@admin_required
def update_user(user_id):
    """Admin updates user details."""
    try:
        db = get_database()
        data = request.json
        
        # Fields that can be updated
        update_fields = {}
        if 'name' in data:
            update_fields['name'] = data['name']
        if 'email' in data:
            update_fields['email'] = data['email']
        if 'role' in data:
            if data['role'] not in ['employee', 'manager', 'admin']:
                return jsonify({'error': 'Invalid role'}), 400
            update_fields['role'] = data['role']
        if 'is_active' in data:
            update_fields['is_active'] = data['is_active']
        if 'department' in data:
            update_fields['department'] = data['department']
        if 'position' in data:
            update_fields['position'] = data['position']
        
        # Update user
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_fields}
        )
        
        # Update employee record if exists
        if update_fields.get('name') or update_fields.get('email'):
            db.employees.update_one(
                {'user_id': ObjectId(user_id)},
                {'$set': {
                    'name': update_fields.get('name'),
                    'email': update_fields.get('email'),
                    'role': update_fields.get('role')
                }}
            )
        
        return jsonify({'message': 'User updated successfully'}), 200
        
    except Exception as e:
        logger.error(f"User update error: {str(e)}")
        return jsonify({'error': 'Failed to update user'}), 500

@admin_bp.route('/users/<user_id>/reset-password', methods=['POST'])
@token_required
@admin_required
def reset_user_password(user_id):
    """Admin resets user password."""
    try:
        data = request.json
        new_password = data.get('new_password')
        
        if not new_password:
            return jsonify({'error': 'New password is required'}), 400
        
        from auth.auth import validate_password, hash_password
        
        # Validate password
        if not validate_password(new_password):
            return jsonify({'error': 'Password must be at least 8 characters with letters and numbers'}), 400
        
        # Hash new password
        hashed_password = hash_password(new_password)
        
        # Update password
        db = get_database()
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'password_hash': hashed_password}}
        )
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        logger.error(f"Password reset error: {str(e)}")
        return jsonify({'error': 'Failed to reset password'}), 500

@admin_bp.route('/projects', methods=['GET'])
@token_required
@admin_required
def get_all_projects():
    """Get all projects for admin."""
    try:
        db = get_database()
        
        projects = list(db.projects.find({}))
        
        result = []
        for project in projects:
            # Get assigned employees
            assignments = list(db.project_assignments.find({'project_id': project['_id']}))
            
            project_data = {
                'id': str(project['_id']),
                'title': project.get('title'),
                'description': project.get('description'),
                'status': project.get('status'),
                'deadline': project.get('deadline'),
                'created_at': project.get('created_at'),
                'priority': project.get('priority'),
                'assigned_employees': len(assignments),
                'progress': project.get('progress', 0)
            }
            result.append(project_data)
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Projects fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch projects'}), 500

@admin_bp.route('/projects', methods=['POST'])
@token_required
@admin_required
def create_project():
    """Admin creates a new project."""
    try:
        data = request.json
        
        required_fields = ['title', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        db = get_database()
        
        project_doc = {
            'title': data['title'],
            'description': data['description'],
            'status': data.get('status', 'planning'),
            'deadline': data.get('deadline'),
            'priority': data.get('priority', 'medium'),
            'created_by': request.user_id,
            'created_at': datetime.utcnow(),
            'progress': 0
        }
        
        result = db.projects.insert_one(project_doc)
        
        return jsonify({
            'message': 'Project created successfully',
            'project_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        logger.error(f"Project creation error: {str(e)}")
        return jsonify({'error': 'Failed to create project'}), 500

@admin_bp.route('/analytics/stats', methods=['GET'])
@token_required
@admin_required
def get_analytics_stats():
    """Get analytics statistics for admin dashboard."""
    try:
        db = get_database()
        
        # User statistics
        total_users = db.users.count_documents({})
        active_users = db.users.count_documents({'is_active': True})
        
        # Role breakdown
        employees = db.users.count_documents({'role': 'employee', 'is_active': True})
        managers = db.users.count_documents({'role': 'manager', 'is_active': True})
        admins = db.users.count_documents({'role': 'admin', 'is_active': True})
        
        # Project statistics
        total_projects = db.projects.count_documents({})
        active_projects = db.projects.count_documents({'status': {'$in': ['planning', 'in_progress']}})
        completed_projects = db.projects.count_documents({'status': 'completed'})
        
        # Activity statistics (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_logins = db.users.count_documents({
            'last_login': {'$gte': thirty_days_ago}
        })
        
        stats = {
            'users': {
                'total': total_users,
                'active': active_users,
                'employees': employees,
                'managers': managers,
                'admins': admins,
                'inactive': total_users - active_users,
                'recent_logins': recent_logins
            },
            'projects': {
                'total': total_projects,
                'active': active_projects,
                'completed': completed_projects,
                'on_hold': total_projects - active_projects - completed_projects
            },
            'system': {
                'uptime': '99.9%',
                'database_size': 'Calculate from MongoDB',
                'last_backup': datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(stats), 200
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        return jsonify({'error': 'Failed to fetch analytics'}), 500

@admin_bp.route('/logs', methods=['GET'])
@token_required
@admin_required
def get_system_logs():
    """Get system logs (authentication, errors, changes)."""
    try:
        db = get_database()
        
        # Check if logs collection exists
        if 'logs' not in db.list_collection_names():
            return jsonify([]), 200
        
        # Get recent logs (last 100)
        logs = list(db.logs.find({}).sort('timestamp', -1).limit(100))
        
        result = []
        for log in logs:
            result.append({
                'id': str(log['_id']),
                'timestamp': log.get('timestamp'),
                'level': log.get('level'),
                'message': log.get('message'),
                'user_id': str(log.get('user_id')) if log.get('user_id') else None,
                'action': log.get('action'),
                'ip_address': log.get('ip_address')
            })
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Logs fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch logs'}), 500

@admin_bp.route('/export/data', methods=['GET'])
@token_required
@admin_required
def export_data():
    """Export system data (users, projects, etc.)."""
    try:
        db = get_database()
        
        # Get all data
        users = list(db.users.find({}))
        employees = list(db.employees.find({}))
        projects = list(db.projects.find({}))
        assignments = list(db.project_assignments.find({}))
        
        # Format data
        export_data = {
            'exported_at': datetime.utcnow().isoformat(),
            'users': len(users),
            'employees': len(employees),
            'projects': len(projects),
            'assignments': len(assignments)
        }
        
        return jsonify(export_data), 200
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        return jsonify({'error': 'Failed to export data'}), 500