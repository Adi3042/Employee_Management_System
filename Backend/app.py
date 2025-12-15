from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from authlib.integrations.flask_client import OAuth
from bson import ObjectId
import json

from auth.auth import (
    init_auth, token_required, register_user, verify_token
)
from utility import get_database, get_logger
from dotenv import load_dotenv
from auth.auth_routes import register_auth_routes
from auth.employees_routes import register_employee_routes
from auth.admin_routes import admin_bp
from auth.manager_routes import manager_bp



logger = get_logger(__name__)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# ---------------------------------------
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key')

app.config.update(
    SESSION_COOKIE_SECURE=False,        # True in production (https)
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    PERMANENT_SESSION_LIFETIME=timedelta(hours=24)
)

# CORS with credentials (MUST include origins)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# ---------------------------------------

# ----------------------------
# Authentication Initialization
# ----------------------------
init_auth(app)

# Initialize OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID', ''),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET', ''),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    api_base_url='https://www.googleapis.com/oauth2/v3/',
    client_kwargs={'scope': 'openid email profile', 'prompt': 'select_account'},
    jwks_uri='https://www.googleapis.com/oauth2/v3/certs'
)

# Register separated AUTH routes
register_auth_routes(app, google)
register_employee_routes(app)

# Register admin and manager blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(manager_bp)

# ----------------------------
# Custom JSON Encoder
# ----------------------------
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)

app.json_encoder = JSONEncoder

# ----------------------------
# Projects
# ----------------------------
@app.route('/api/projects', methods=['GET'])
def get_projects():
    db = get_database()
    projects_col = db.projects
    assign_col = db.project_assignments

    employee_id = request.args.get("employee_id")
    auth_header = request.headers.get("Authorization", "")

    is_demo = ("demo-token-" in auth_header) or (
        employee_id and ("demo" in employee_id or not ObjectId.is_valid(employee_id))
    )

    if is_demo:
        return jsonify([
            {
                'id': 'project1',
                'title': 'Alpha Launch Phase 2',
                'description': 'Complete the second phase of alpha product launch.',
                'deadline': (datetime.utcnow() + timedelta(days=30)).isoformat(),
                'status': 'In Progress',
                'progress': 45
            },
            {
                'id': 'project2',
                'title': 'Q4 Marketing Strategy',
                'description': 'Develop and implement marketing strategy for Q4.',
                'deadline': (datetime.utcnow() + timedelta(days=45)).isoformat(),
                'status': 'Completed',
                'progress': 100
            }
        ])

    # Authentication check for real users
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Authentication required"}), 401

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    try:
        if employee_id and ObjectId.is_valid(employee_id):
            assignments = list(assign_col.find({'employee_id': ObjectId(employee_id)}))
            project_ids = [a['project_id'] for a in assignments]
            projects = list(projects_col.find({'_id': {'$in': project_ids}}))

            # Add progress field
            for p in projects:
                for a in assignments:
                    if a['project_id'] == p['_id']:
                        p['progress'] = a.get('progress', 0)
        else:
            projects = list(projects_col.find({}))

        # Convert ObjectIds
        formatted = []
        for p in projects:
            p['id'] = str(p['_id'])
            if isinstance(p.get("deadline"), datetime):
                p['deadline'] = p['deadline'].isoformat()
            formatted.append(p)

        return jsonify(formatted)
    except Exception as e:
        logger.error(f"Error fetching projects: {str(e)}")
        return jsonify({'error': 'Failed to fetch projects'}), 500


# ----------------------------
# Messages
# ----------------------------
@app.route('/api/messages', methods=['GET'])
@token_required
def get_messages():
    user_id = request.args.get('user_id')

    if 'demo' in str(user_id) or not ObjectId.is_valid(user_id):
        return jsonify([
            {
                'id': 'manager123',
                'name': 'Sarah Wilson',
                'role': 'manager',
                'last_message': "Hi Alex, how's the Alpha Launch project going?",
                'timestamp': datetime.utcnow().isoformat(),
                'unread': False
            },
            {
                'id': 'employee456',
                'name': 'Mike Chen',
                'role': 'employee',
                'last_message': 'Can you review my PR?',
                'timestamp': datetime.utcnow().isoformat(),
                'unread': True
            }
        ])

    # 🔥 TODO: Add real MongoDB message fetching
    return jsonify([])


@app.route('/api/messages', methods=['POST'])
@token_required
def send_message():
    data = request.json
    # TODO: Save message to MongoDB
    return jsonify({'message': 'Message sent successfully'})


# ----------------------------
# DB Init + Reset
# ----------------------------
def init_database():
    db = get_database()
    collections = ['users', 'employees', 'projects', 'project_assignments', 'messages']

    for c in collections:
        if c not in db.list_collection_names():
            db.create_collection(c)

    db.users.create_index('email', unique=True)
    db.users.create_index('google_id', unique=True, sparse=True)


@app.route('/api/reset-database', methods=['POST'])
def reset_database():
    try:
        db = get_database()
        for c in ['users', 'employees', 'projects', 'project_assignments', 'messages']:
            db[c].delete_many({})

        register_user('admin@company.com', 'Admin123!', 'Admin User', 'admin')

        return jsonify({'message': 'Database reset successfully!'})
    except Exception as e:
        logger.error(f"Database reset failed: {str(e)}")
        return jsonify({'error': 'Database reset failed'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})


# ----------------------------
# Start Server
# ----------------------------
if __name__ == '__main__':
    from app import init_database
    with app.app_context():
        init_database()

    app.run(debug=True, port=5000)