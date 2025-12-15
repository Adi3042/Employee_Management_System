import logger
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import re
from dotenv import load_dotenv
import hashlib
from logger import get_logger
import os
import bcrypt


# Initialize logger
logger = get_logger(__name__)

# Load environment variables
load_dotenv()

def connect_to_mongodb(uri):
    """Connect to MongoDB with the given URI."""
    try:
        logger.info(f"Attempting to connect to MongoDB at: {uri}")
        client = MongoClient(uri, server_api=ServerApi('1'))
        
        # Test the connection
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB and verified connection")
        
        return client
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}", exc_info=True)
        raise ConnectionError(f"Could not connect to MongoDB: {str(e)}")

def get_mongodb_client():
    """Get MongoDB client instance."""
    mongo_uri = os.environ.get('MONGODB_URI', 'mongodb+srv://admin:Aditya1967@cluster0.1wwnm.mongodb.net/employee_management?retryWrites=true&w=majority&appName=Cluster0')
    return connect_to_mongodb(mongo_uri)

def get_database():
    """Get database instance."""
    client = get_mongodb_client()
    db_name = os.environ.get('MONGODB_DB', 'employee_management')
    return client[db_name]

# Validation functions remain the same
def validate_email(email):
    """Validate email format."""
    try:
        logger.debug(f"Validating email: {email}")
        is_valid = re.match(r"[^@]+@[^@]+\.[^@]+", email)
        if not is_valid:
            logger.warning(f"Invalid email format: {email}")
        return bool(is_valid)
    except Exception as e:
        logger.error(f"Email validation error: {str(e)}", exc_info=True)
        return False

def validate_password(password):
    """Validate password strength."""
    try:
        logger.debug("Validating password strength")
        has_letter = bool(re.search(r"[A-Za-z]", password))
        has_digit = bool(re.search(r"\d", password))
        is_length_valid = len(password) >= 8
        
        if not all([has_letter, has_digit, is_length_valid]):
            logger.warning(
                f"Password validation failed - "
                f"Length: {'OK' if is_length_valid else 'Too short'}, "
                f"Letters: {'OK' if has_letter else 'Missing'}, "
                f"Digits: {'OK' if has_digit else 'Missing'}"
            )
        return all([has_letter, has_digit, is_length_valid])
    except Exception as e:
        logger.error(f"Password validation error: {str(e)}", exc_info=True)
        return False

def validate_phone(phone):
    """Validate phone number format."""
    try:
        logger.debug(f"Validating phone number: {phone}")
        is_valid = re.match(r"^[0-9]{10,15}$", phone)
        if not is_valid:
            logger.warning(f"Invalid phone number format: {phone}")
        return bool(is_valid)
    except Exception as e:
        logger.error(f"Phone validation error: {str(e)}", exc_info=True)
        return False

def hash_password(password):
    """Hash password using bcrypt."""
    try:
        logger.debug("Hashing password with bcrypt")
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        logger.debug("Password hashed successfully")
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"Password hashing failed: {str(e)}", exc_info=True)
        raise RuntimeError(f"Password hashing error: {str(e)}")

def verify_password(password, hashed_password):
    """Verify password against hashed password."""
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Password verification failed: {str(e)}")
        return False

def generate_verification_token():
    """Generate a secure verification token."""
    import secrets
    return secrets.token_urlsafe(32)