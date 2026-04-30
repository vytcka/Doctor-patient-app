from flask import Flask, render_template 
from flask_sqlalchemy import SQLAlchemy
from .config import Config
from flask_wtf import CSRFProtect
from flask_talisman import Talisman
import logging
from logging.handlers import RotatingFileHandler
import re
import os
from flask_cors import CORS
from datetime import date

db = SQLAlchemy()
#definining sanitisation for logs
def sanitisationForLogs(val:str) -> str:
    return re.sub(r'[\n\r\t]', '_SPECIAL_CHARACTER_', str(val))

def create_app():
    #setting up logs:
    #------------------------
    if not os.path.exists('logs'):
        os.mkdir('logs')

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    if not logger.hasHandlers():

        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        fileHandler = RotatingFileHandler('logs/appLog.log', maxBytes=5*1024*1024, backupCount=3)
        consoleHandler = logging.StreamHandler()
        consoleHandler.setLevel(logging.INFO)
    
        consoleHandler.setFormatter(formatter)
        fileHandler.setFormatter(formatter)
        
        logger.addHandler(fileHandler)
        logger.addHandler(consoleHandler)
    

    #------------------------


    app = Flask(__name__)   
  
    csp = {
        'default-src': "'self'"
    }
    Talisman(app, content_security_policy = csp, force_https=False)
    app.secret_key = Config.SECRET_KEY
    # applying CSRF protection to legitimise requests
    csrf = CSRFProtect(app)
    app.config.from_object(Config)

    db.init_app(app)

    from .routes import main
    app.register_blueprint(main)


    @app.errorhandler(400)
    def bad_request(error):
            return render_template('badRequest.html'), 400
    @app.errorhandler(403)
    def forbidden(error):
        return render_template('forbidden.html', message="Access Denied"), 403
    @app.errorhandler(404)
    def not_found(error):
        return render_template('notFound.html'), 404
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return render_template('internalServerError.html'), 500

    with app.app_context():
        from .models import User
        db.drop_all()
        db.create_all()

        

    users = [
    {
        "id": 123222,
        "username": "patient1@email.com",
        "password": "Patientpass!23",
        "role": "patient",
        "bio": "I'm a basic patient",
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": date(1998, 5, 14),
        "location": "Newcastle, UK",
        "is_banned": False,
        "is_suspended": False,
        "suspension_reason": None
    },
    {
        "id": 123223,
        "username": "doctor1@email.com",
        "password": "Doctorpass!23",
        "role": "doctor",
        "bio": "Experienced GP with a focus on preventative healthcare.",
        "first_name": "Sarah",
        "last_name": "Mitchell",
        "date_of_birth": date(1982, 11, 3),
        "location": "Manchester, UK",
        "is_banned": False,
        "is_suspended": False,
        "suspension_reason": None
    },
    {
        "id": 123224,
        "username": "admin1@email.com",
        "password": "Adminpass!23",
        "role": "admin",
        "bio": "System administrator responsible for maintaining platform integrity.",
        "first_name": "Michael",
        "last_name": "Reed",
        "date_of_birth": date(1975, 7, 21),
        "location": "London, UK",
        "is_banned": False,
        "is_suspended": False,
        "suspension_reason": None
    },
    {
        "id": 123225,
        "username": "patient2@email.com",
        "password": "Patientpass!45",
        "role": "patient",
        "bio": "Interested in tracking long-term health goals.",
        "first_name": "Emma",
        "last_name": "Wilson",
        "date_of_birth": date(2001, 2, 8),
        "location": "Leeds, UK",
        "is_banned": False,
        "is_suspended": True,
        "suspension_reason": "Violation of community guidelines"
    },
    {
        "id": 123226,
        "username": "doctor2@email.com",
        "password": "Doctorpass!56",
        "role": "doctor",
        "bio": "Cardiologist with 12 years of clinical experience.",
        "first_name": "James",
        "last_name": "Turner",
        "date_of_birth": date(1979, 9, 17),
        "location": "Birmingham, UK",
        "is_banned": False,
        "is_suspended": False,
        "suspension_reason": None
    },
    {
        "id": 123227,
        "username": "patient3@email.com",
        "password": "Patientpass!78",
        "role": "patient",
        "bio": "Fitness enthusiast recovering from a sports injury.",
        "first_name": "Olivia",
        "last_name": "Brown",
        "date_of_birth": date(1995, 6, 30),
        "location": "Liverpool, UK",
        "is_banned": True,
        "is_suspended": False,
        "suspension_reason": None
    }
]
        
    """class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='user', nullable=False)
    bio = db.Column(db.String(3000), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    is_banned = db.Column(db.Boolean, default=False, nullable=False)
    is_suspended = db.Column(db.Boolean, default=False, nullable=False)
    suspension_reason = db.Column(db.String(255), nullable=True)"""

    for user in users:
            user = User(username=user["username"], password=user["password"], role=user["role"], bio=user["bio"])
            db.session.add(user)
            db.session.commit()
    CORS(app, supports_credentials=True)

    return app

