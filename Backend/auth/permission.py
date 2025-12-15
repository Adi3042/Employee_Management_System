from functools import wraps
from flask import request, jsonify
from logger import get_logger

logger = get_logger(__name__)

def role_required(*required_roles):
    """Decorator to require specific roles."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Check if token_required already ran
            if not hasattr(request, 'user_role'):
                return jsonify({'error': 'Authentication required'}), 401
            
            if request.user_role not in required_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator

def admin_required(f):
    """Decorator to require admin role."""
    return role_required('admin')(f)

def manager_or_admin_required(f):
    """Decorator to require manager or admin role."""
    return role_required('manager', 'admin')(f)