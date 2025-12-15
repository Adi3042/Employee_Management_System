from flask import request, jsonify, redirect, url_for, session
import os
import urllib.parse
from datetime import datetime
from bson import ObjectId

from auth.auth import (
    register_user, login_user, verify_email,
    google_auth_callback, verify_token
)

from utility import get_database, get_logger

logger = get_logger(__name__)


def register_auth_routes(app, google):

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')
            role = data.get('role', 'employee')

            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400

            response, status = register_user(email, password, name, role)
            return jsonify(response), status
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return jsonify({'error': 'Registration failed'}), 500

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        try:
            data = request.json
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400

            response, status = login_user(email, password)
            return jsonify(response), status
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return jsonify({'error': 'Login failed'}), 500

    @app.route('/api/auth/verify-email/<token>', methods=['GET'])
    def verify_email_route(token):
        try:
            response, status = verify_email(token)
            return jsonify(response), status
        except Exception as e:
            logger.error(f"Email verification failed: {str(e)}")
            return jsonify({'error': 'Email verification failed'}), 500

    @app.route('/api/auth/google')
    def google_login():
        try:
            redirect_uri = url_for('google_callback', _external=True)
            return google.authorize_redirect(redirect_uri)
        except Exception as e:
            logger.error(f"Google login init failed: {str(e)}")
            return jsonify({'error': 'Failed to start Google login'}), 500

    @app.route('/api/auth/google/callback')
    def google_callback():
        try:
            token = google.authorize_access_token()
            nonce = session.pop('oauth_nonce', None)
            user_info = google.parse_id_token(token, nonce=nonce)

            auth_result = google_auth_callback(user_info)

            if isinstance(auth_result, tuple) and len(auth_result) == 2:
                data, status = auth_result

                frontend = os.environ.get("FRONTEND_URL", "http://localhost:5173")

                if status == 200:
                    session['oauth_data'] = data
                    return redirect(f"{frontend}/oauth-success")

                error_msg = urllib.parse.quote(data.get("error", "Authentication failed"))
                return redirect(f"{frontend}/login?error={error_msg}")

            frontend = os.environ.get("FRONTEND_URL", "http://localhost:5173")
            return redirect(f"{frontend}/login?error=Unexpected%20error")

        except Exception as e:
            logger.error(f"Google callback failed: {str(e)}", exc_info=True)
            frontend = os.environ.get("FRONTEND_URL", "http://localhost:5173")
            return redirect(f"{frontend}/login?error=Google%20authentication%20failed")

    @app.route('/api/auth/oauth-data', methods=['GET'])
    def get_oauth_data():
        data = session.get('oauth_data')
        if data:
            response = jsonify(data)
            session.pop('oauth_data', None)
            return response
        return jsonify({'error': 'No OAuth data found'}), 404

    @app.route('/api/auth/me', methods=['GET'])
    def get_current_user():
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return jsonify({'error': 'No token provided'}), 401

        token = auth.split(" ")[1]
        payload = verify_token(token)

        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401

        # Demo user detection
        if "demo" in token:
            if "employee" in token:
                return jsonify({
                    "id": "employee123",
                    "email": "alex.johnson@company.com",
                    "name": "Alex Johnson",
                    "role": "employee"
                })

            if "manager" in token:
                return jsonify({
                    "id": "manager123",
                    "email": "sarah.wilson@company.com",
                    "name": "Sarah Wilson",
                    "role": "manager"
                })

            return jsonify({
                "id": "admin123",
                "email": "admin@company.com",
                "name": "Admin User",
                "role": "admin"
            })

        try:
            db = get_database()
            users = db.users
            user = users.find_one({"_id": ObjectId(payload["user_id"])})

            if not user:
                return jsonify({"error": "User not found"}), 404

            return jsonify({
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user.get("name"),
                "role": user.get("role", "employee"),
                "picture": user.get("picture")
            })
        except Exception as e:
            logger.error(f"Error fetching user: {str(e)}")
            return jsonify({"error": "Failed to fetch user"}), 500
