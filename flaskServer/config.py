import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1, minutes=20)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False
