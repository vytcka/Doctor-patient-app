from flask import Flask, request, render_template 
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_wtf import CSRFProtect
from flask_talisman import Talisman
import logging
from logging.handlers import RotatingFileHandler
import re
import os

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
        from .models import User
        db.drop_all()
        db.create_all()

        

        users = [
            {"username": "user1@email.com", "password": "Userpass!23", "role": "user", "bio": "I'm a basic user"},
            {"username": "mod1@email.com", "password": "Modpass!23", "role": "moderator", "bio": "I'm a moderator"},
            {"username": "admin1@email.com", "password": "Adminpass!23", "role": "admin", "bio": "I'm an administrator"}
        ]

        for user in users:
            user = User(username=user["username"], password=user["password"], role=user["role"], bio=user["bio"])
            db.session.add(user)
            db.session.commit()

    return app

