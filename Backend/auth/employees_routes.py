# auth/employees_routes.py

from flask import request, jsonify
from bson import ObjectId
from utility import get_database, get_logger
from auth.auth import token_required
from datetime import datetime, timedelta
from auth.permission import admin_required, manager_or_admin_required


logger = get_logger(__name__)


def register_employee_routes(app):

    # ----------------------------
    # GET All Employees
    # ----------------------------
    @app.route('/api/employees', methods=['GET'])
    def get_employees():
        db = get_database()
        col = db.employees

        auth_header = request.headers.get("Authorization", "")
        is_demo = "demo-token-" in auth_header

        # Demo response
        if is_demo:
            return jsonify([
                {
                    'id': 'employee123',
                    'name': 'Alex Johnson',
                    'email': 'alex.johnson@company.com',
                    'role': 'employee',
                    'manager_name': 'Sarah Wilson'
                },
                {
                    'id': 'manager123',
                    'name': 'Sarah Wilson',
                    'email': 'sarah.wilson@company.com',
                    'role': 'manager',
                    'manager_name': None
                },
                {
                    'id': 'admin123',
                    'name': 'Admin User',
                    'email': 'admin@company.com',
                    'role': 'admin',
                    'manager_name': None
                }
            ])

        # Real DB flow
        try:
            employees = list(col.find({}))
            result = []

            for emp in employees:
                emp_data = {
                    "id": str(emp["_id"]),
                    "name": emp.get("name", ""),
                    "email": emp.get("email", ""),
                    "role": emp.get("role", "employee")
                }

                if emp.get("manager_id"):
                    manager = col.find_one({"_id": emp["manager_id"]})
                    emp_data["manager_name"] = manager["name"] if manager else None
                else:
                    emp_data["manager_name"] = None

                result.append(emp_data)

            return jsonify(result)

        except Exception as e:
            logger.error(f"Error fetching employees: {str(e)}")
            return jsonify({"error": "Failed to fetch employees"}), 500

    # ----------------------------
    # GET Employee Manager
    # ----------------------------
    @app.route('/api/employees/<employee_id>/manager', methods=['GET'])
    @token_required
    def get_manager(employee_id):

        if 'demo' in employee_id or not ObjectId.is_valid(employee_id):
            return jsonify({
                'id': 'manager123',
                'name': 'Sarah Wilson',
                'email': 'sarah.wilson@company.com'
            })

        try:
            db = get_database()
            col = db.employees

            employee = col.find_one({"_id": ObjectId(employee_id)})
            if not employee:
                return jsonify({'error': 'Employee not found'}), 404

            if employee.get("manager_id"):
                manager = col.find_one({'_id': employee['manager_id']})
                if manager:
                    return jsonify({
                        "id": str(manager["_id"]),
                        "name": manager["name"],
                        "email": manager["email"]
                    })

            return jsonify(None)

        except Exception as e:
            logger.error(f"Error fetching manager: {str(e)}")
            return jsonify({'error': 'Failed to fetch manager'}), 500
