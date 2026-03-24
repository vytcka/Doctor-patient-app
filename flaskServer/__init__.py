from flask import Flask, request, render_template 
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
#definining santisation for logs
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
        from .models import User, Doctor
        db.drop_all()
        db.create_all()

        # seed users (role = 'user' / patient accounts)
        users = [
            {
                "username": "user1@email.com", "password": "Userpass!23",
                "role": "user", "bio": "I'm a basic user",
                "first_name": "Alice", "last_name": "Smith",
                "date_of_birth": date(1990, 1, 1), "location": "London"
            },
            {
                "username": "user2@email.com", "password": "Userpass!23",
                "role": "user", "bio": "I'm another basic user",
                "first_name": "Bob", "last_name": "Jones",
                "date_of_birth": date(1985, 5, 12), "location": "Manchester"
            },
        ]

        for u in users:
            user = User(
                username=u["username"], password=u["password"],
                role=u["role"], bio=u["bio"],
                first_name=u["first_name"], last_name=u["last_name"],
                date_of_birth=u["date_of_birth"], location=u["location"]
            )
            db.session.add(user)
            db.session.commit()

        # seed doctors (role = 'doctor')
        doctors = [
            {
                "nhs_number": "1234567890", "first_name": "James", "last_name": "Wilson",
                "username": "doctor1@nhs.co.uk", "password": "Doctorpass!1",
                "date_of_birth": date(1975, 3, 10), "location": "London",
                "specialty": "Cardiology", "language": "English",
                "bio": "I am an experienced cardiologist with 20 years of practice.",
                "availability": True, "rating": None
            },
            {
                "nhs_number": "0987654321", "first_name": "Sarah", "last_name": "Connor",
                "username": "doctor2@nhs.co.uk", "password": "Doctorpass!2",
                "date_of_birth": date(1982, 7, 22), "location": "Manchester",
                "specialty": "Paediatrics", "language": "English",
                "bio": "I am a dedicated paediatrician specialising in early childhood care.",
                "availability": True, "rating": None
            },
            {
                "nhs_number": "1122334455", "first_name": "Ahmed", "last_name": "Khan",
                "username": "doctor3@nhs.co.uk", "password": "Doctorpass!3",
                "date_of_birth": date(1979, 11, 5), "location": "Birmingham",
                "specialty": "General Practice", "language": "English",
                "bio": "I am a general practitioner with a focus on preventative medicine.",
                "availability": False, "rating": None
            },
        ]

        for d in doctors:
            doctor = Doctor(
                nhs_number=d["nhs_number"], first_name=d["first_name"],
                last_name=d["last_name"], username=d["username"],
                password=d["password"], date_of_birth=d["date_of_birth"],
                location=d["location"], specialty=d["specialty"],
                language=d["language"], bio=d["bio"],
                availability=d["availability"], rating=d["rating"]
            )
            db.session.add(doctor)
            db.session.commit()

    CORS(app, supports_credentials=True)

    return app