import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = "super-secret-key"
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1, minutes=20)
    try:
        value = os.environ.get('DATABASE_URL')
        SQLALCHEMY_DATABASE_URI = value
    except:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False
