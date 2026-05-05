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
    csp = {
        'default-src': "'self'"}

    
    app = Flask(__name__)
    app.config.from_object(Config)

    app.config["WTF_CSRF_ENABLED"] = False

    Talisman(app, content_security_policy=csp, force_https=False)
    db.init_app(app)
    
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

    from .routes import main
    app.register_blueprint(main)


    users = [
{
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
    from .models import User, Doctor, Review
    with app.app_context():
            db.create_all()
            if User.query.count() == 0:
                for user_data in users:
                    user = User(
                        username=user_data["username"],
                        password=user_data["password"],
                        role=user_data["role"],
                        bio=user_data["bio"],
                        first_name=user_data["first_name"],
                        last_name=user_data["last_name"],
                        date_of_birth=user_data["date_of_birth"],
                        location=user_data["location"],
                        is_banned=user_data["is_banned"],
                        is_suspended=user_data["is_suspended"],
                        suspension_reason=user_data["suspension_reason"]
                    )
                    db.session.add(user)
                db.session.commit()
            
            # Doctor data with reviews
            doctors = [
                {
                    "nhs_number": "1234567890",
                    "first_name": "James",
                    "last_name": "Turner",
                    "username": "jamesturner@email.com",
                    "password": "Doctorpass!23",
                    "role": "doctor",
                    "date_of_birth": date(1980, 1, 1),
                    "location": "Newcastle, UK",
                    "specialty": "Cardiology",
                    "gender": "Male",
                    "language": "English,Spanish,French",
                    "bio": "My name is James Turner and I've been working as a cardiologist for 10 years.",
                    "availability": True,
                    "reviews": [
                        {"rating": 5, "comment": "Excellent doctor! Very knowledgeable and caring."},
                        {"rating": 4, "comment": "Good experience, but the wait time was a bit long."}
                    ]
                },
                {
                    "nhs_number": "0987654321",
                    "first_name": "Jane",
                    "last_name": "Smith",
                    "username": "janesmith@email.com",
                    "password": "Doctorpass!23",
                    "role": "doctor",
                    "date_of_birth": date(1985, 5, 15),
                    "location": "Liverpool, UK",
                    "specialty": "Pediatrics",
                    "gender": "Female",
                    "language": "English,Spanish",
                    "bio": "Hi! I'm Jane Smith. I'm a pediatrician working for 12 years.",
                    "availability": True,
                    "reviews": [
                        {"rating": 3, "comment": "Average experience."},
                        {"rating": 4, "comment": "Good doctor! My child felt comfortable and well cared for."}
                    ]
                }
            ]
            
            # Seed doctors and reviews
            if Doctor.query.count() == 0:
                for doc_data in doctors:
                    doctor = Doctor(
                        nhs_number=doc_data["nhs_number"],
                        first_name=doc_data["first_name"],
                        last_name=doc_data["last_name"],
                        username=doc_data["username"],
                        password=doc_data["password"],
                        date_of_birth=doc_data["date_of_birth"],
                        location=doc_data["location"],
                        specialty=doc_data["specialty"],
                        gender=doc_data["gender"],
                        language=doc_data["language"],
                        bio=doc_data["bio"],
                        availability=doc_data["availability"]
                    )
                    db.session.add(doctor)
                    db.session.flush()  # Get doctor ID for reviews
                    
                    # Seed reviews
                    for review_data in doc_data["reviews"]:
                        review = Review(
                            user_id=1,  # Link to seeded user (patient1)
                            doctor_id=doctor.nhs_number,
                            rating=review_data["rating"],
                            comment=review_data["comment"],
                            status=True  # Approved
                        )
                        db.session.add(review)
                
                db.session.commit()
    CORS(app, supports_credentials=True)
    return app