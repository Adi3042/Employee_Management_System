from flask import Blueprint, request, jsonify
from bson import ObjectId
from logger import get_logger
from utility import get_database
from auth.auth import (
    token_required, create_user_by_manager, delete_user,
    change_employee_manager, assign_project_to_employee
)
from auth.permission import admin_required, manager_or_admin_required


logger = get_logger(__name__)

manager_bp = Blueprint('manager', __name__, url_prefix='/api/manager')

@manager_bp.route('/employees', methods=['POST'])
@token_required
@manager_or_admin_required
def create_employee():
    """Manager creates a new employee."""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        response, status = create_user_by_manager(
            email=email,
            password=password,
            name=name,
            created_by_manager_id=str(request.user_id)
        )
        return jsonify(response), status
        
    except Exception as e:
        logger.error(f"Employee creation error: {str(e)}")
        return jsonify({'error': 'Employee creation failed'}), 500

@manager_bp.route('/employees/<employee_id>', methods=['DELETE'])
@token_required
@manager_or_admin_required
def delete_employee(employee_id):
    """Manager deletes an employee from their team."""
    try:
        response, status = delete_user(employee_id, str(request.user_id))
        return jsonify(response), status
    except Exception as e:
        logger.error(f"Employee deletion error: {str(e)}")
        return jsonify({'error': 'Employee deletion failed'}), 500

@manager_bp.route('/team', methods=['GET'])
@token_required
@manager_or_admin_required
def get_team():
    """Get manager's team members."""
    try:
        db = get_database()
        
        # Get manager's employees
        employees = list(db.employees.find({'manager_id': request.user_id, 'is_active': True}))
        
        result = []
        for emp in employees:
            user = db.users.find_one({'_id': emp['user_id']})
            if user:
                result.append({
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role'],
                    'hire_date': emp.get('created_at'),
                    'department': emp.get('department'),
                    'position': emp.get('position')
                })
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Team fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch team'}), 500

@manager_bp.route('/employees/<employee_id>/change-manager', methods=['PUT'])
@token_required
@manager_or_admin_required
def change_employee_manager_route(employee_id):
    """Change an employee's manager (admin or current manager)."""
    try:
        data = request.json
        new_manager_id = data.get('new_manager_id')
        
        if not new_manager_id:
            return jsonify({'error': 'New manager ID is required'}), 400
        
        response, status = change_employee_manager(
            employee_id=employee_id,
            new_manager_id=new_manager_id,
            changed_by_id=str(request.user_id)
        )
        return jsonify(response), status
        
    except Exception as e:
        logger.error(f"Manager change error: {str(e)}")
        return jsonify({'error': 'Failed to change manager'}), 500

@manager_bp.route('/projects/assign', methods=['POST'])
@token_required
@manager_or_admin_required
def assign_project():
    """Assign a project to an employee."""
    try:
        data = request.json
        project_id = data.get('project_id')
        employee_id = data.get('employee_id')
        
        if not project_id or not employee_id:
            return jsonify({'error': 'Project ID and Employee ID are required'}), 400
        
        response, status = assign_project_to_employee(
            project_id=project_id,
            employee_id=employee_id,
            assigned_by_id=str(request.user_id)
        )
        return jsonify(response), status
        
    except Exception as e:
        logger.error(f"Project assignment error: {str(e)}")
        return jsonify({'error': 'Failed to assign project'}), 500

@manager_bp.route('/available-projects', methods=['GET'])
@token_required
@manager_or_admin_required
def get_available_projects():
    """Get all available projects for assignment."""
    try:
        db = get_database()
        
        projects = list(db.projects.find({'status': {'$in': ['planning', 'in_progress']}}))
        
        result = []
        for project in projects:
            result.append({
                'id': str(project['_id']),
                'title': project['title'],
                'description': project.get('description'),
                'status': project.get('status'),
                'deadline': project.get('deadline'),
                'priority': project.get('priority')
            })
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Projects fetch error: {str(e)}")
        return jsonify({'error': 'Failed to fetch projects'}), 500