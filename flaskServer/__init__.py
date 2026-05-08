from flask import Flask, render_template 
from flask_sqlalchemy import SQLAlchemy
from .config import Config
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
    CORS(app, supports_credentials=True,origins=["http://localhost:3000"])

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
    doctors = [
        {
            "nhs_number": "1234567890",
            "first_name": "James",
            "last_name": "Turner",
            "username": "jamesturner@email.com",
            "password": "Doctorpass!23",
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

    moderators = [
        {
            "username": "moderator1@email.com",
            "password": "Moderatorpass!23",
            "bio": "Platform moderator responsible for reviewing reports and maintaining community standards."
        }
    ]

    with app.app_context():
        db.create_all()
        from .models import User, Doctor, Review, Moderator, Chat, Message

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
                db.session.flush()

                ratings = []
                for review_data in doc_data["reviews"]:
                    review = Review(
                        user_id=1,
                        doctor_id=doctor.nhs_number,
                        rating=review_data["rating"],
                        comment=review_data["comment"],
                        status=True
                    )
                    db.session.add(review)
                    ratings.append(review_data["rating"])

                avg_rating = sum(ratings) / len(ratings)
                doctor.set_rating(round(avg_rating, 1))

            db.session.commit()

        if Moderator.query.count() == 0:
            for mod_data in moderators:
                moderator = Moderator(
                    username=mod_data["username"],
                    password=mod_data["password"],
                    bio=mod_data["bio"]
                )
                db.session.add(moderator)
                db.session.commit()
            
        if Chat.query.count() == 0:
            patient1 = User.query.filter_by(username="patient1@email.com").first()
            patient2 = User.query.filter_by(username="patient2@email.com").first()
            patient3 = User.query.filter_by(username="patient3@email.com").first()

            if patient1:
                # Chat 1 - Active chest pain consultation
                chat1 = Chat(sender_id=patient1.id, receiver_id=patient1.id, status="CHAT_STATUS_ACTIVE")
                db.session.add(chat1)
                db.session.flush()
                for sender_id, sender_type, content in [
                    (str(patient1.id), "user",   "Hello Dr. Turner, I've been having sharp chest pains for the past 3 days."),
                    ("1234567890",     "doctor", "Hello John! I'm sorry to hear that. Can you describe the pain? Is it sharp, dull, or burning?"),
                    (str(patient1.id), "user",   "It's sharp, mostly on the left side. Gets worse when I breathe deeply."),
                    ("1234567890",     "doctor", "That's concerning. Are you experiencing any shortness of breath or dizziness?"),
                    (str(patient1.id), "user",   "Yes, especially when climbing stairs. I feel out of breath quite quickly."),
                    ("1234567890",     "doctor", "I'd like you to come in for an ECG. Are you free tomorrow morning?"),
                    (str(patient1.id), "user",   "Yes I can do 9am. Should I be worried?"),
                    ("1234567890",     "doctor", "Try not to worry. It's likely muscular but we need to rule out cardiac causes. Avoid strenuous activity until then."),
                    (str(patient1.id), "user",   "Okay thank you doctor. I'll see you tomorrow."),
                    ("1234567890",     "doctor", "See you then John. If the pain becomes severe or you feel faint, go to A&E immediately."),
                ]:
                    db.session.add(Message(chat_id=chat1.id, sender_id=sender_id, sender_type=sender_type, content=content))
                    chat1.increment_message_count()

                # Chat 2 - Active headache/migraine consultation
                chat2 = Chat(sender_id=patient1.id, receiver_id=patient1.id, status="CHAT_STATUS_ACTIVE")
                db.session.add(chat2)
                db.session.flush()
                for sender_id, sender_type, content in [
                    (str(patient1.id), "user",   "Hi Dr. Smith, I've been getting terrible headaches every morning for a week."),
                    ("0987654321",     "doctor", "Good morning! Are the headaches on one side or both sides of your head?"),
                    (str(patient1.id), "user",   "Mostly one side, the right side. Sometimes I see flashing lights before it starts."),
                    ("0987654321",     "doctor", "That sounds like it could be migraines. Do you feel nauseous during these episodes?"),
                    (str(patient1.id), "user",   "Yes very nauseous, and light makes it much worse. I have to lie in a dark room."),
                    ("0987654321",     "doctor", "Classic migraine symptoms. How long do they typically last?"),
                    (str(patient1.id), "user",   "Usually 4-6 hours. Sometimes up to a whole day."),
                    ("0987654321",     "doctor", "I'd like to prescribe sumatriptan for the acute attacks. Have you tried any pain relief so far?"),
                    (str(patient1.id), "user",   "Just ibuprofen but it barely touches it."),
                    ("0987654321",     "doctor", "Ibuprofen isn't effective for migraines unfortunately. I'll send a prescription to your pharmacy. Also keep a headache diary so we can identify triggers."),
                    (str(patient1.id), "user",   "Thank you so much! What kind of triggers should I look out for?"),
                    ("0987654321",     "doctor", "Common ones are stress, dehydration, caffeine, irregular sleep, and certain foods like chocolate or red wine. Try to track what you did before each attack."),
                ]:
                    db.session.add(Message(chat_id=chat2.id, sender_id=sender_id, sender_type=sender_type, content=content))
                    chat2.increment_message_count()

                # Chat 3 - Closed follow up consultation
                chat3 = Chat(sender_id=patient1.id, receiver_id=patient1.id, status="CHAT_STATUS_CLOSED")
                db.session.add(chat3)
                db.session.flush()
                for sender_id, sender_type, content in [
                    (str(patient1.id), "user",   "Hi doctor, just following up on my blood test results from last week."),
                    ("1234567890",     "doctor", "Hi John! Yes I have your results here. Your cholesterol is slightly elevated at 5.8 mmol/L."),
                    (str(patient1.id), "user",   "Is that dangerous? Should I be worried?"),
                    ("1234567890",     "doctor", "Not dangerous yet but we should address it. I'd recommend dietary changes first before considering medication."),
                    (str(patient1.id), "user",   "What changes should I make?"),
                    ("1234567890",     "doctor", "Reduce saturated fats — less red meat, butter, cheese. Increase oily fish, nuts, and fibre. Exercise at least 30 minutes 5 times a week."),
                    (str(patient1.id), "user",   "Okay I can do that. Should I come back for another test?"),
                    ("1234567890",     "doctor", "Yes, let's retest in 3 months. If levels haven't improved we'll discuss statins. Any other questions?"),
                    (str(patient1.id), "user",   "No that's great, thank you doctor!"),
                    ("1234567890",     "doctor", "Take care John. Remember small consistent changes make a big difference over time. Goodbye!"),
                ]:
                    db.session.add(Message(chat_id=chat3.id, sender_id=sender_id, sender_type=sender_type, content=content))
                    chat3.increment_message_count()

                # Chat 4 - Withdrawn early (patient changed mind)
                chat4 = Chat(sender_id=patient1.id, receiver_id=patient1.id, status="CHAT_STATUS_WITHDRAWN")
                chat4.withdrawn = True
                chat4.withdrawn_early = True
                db.session.add(chat4)
                db.session.flush()
                for sender_id, sender_type, content in [
                    (str(patient1.id), "user",   "Hi, I have a question about a rash on my arm."),
                    ("0987654321",     "doctor", "Of course! Can you describe it? Is it red, raised, itchy?"),
                    (str(patient1.id), "user",   "Actually it seems to have cleared up on its own. Sorry to bother you!"),
                ]:
                    db.session.add(Message(chat_id=chat4.id, sender_id=sender_id, sender_type=sender_type, content=content))
                    chat4.increment_message_count()

            if patient2:
                # Chat 5 - Active back pain consultation for patient2
                chat5 = Chat(sender_id=patient2.id, receiver_id=patient2.id, status="CHAT_STATUS_ACTIVE")
                db.session.add(chat5)
                db.session.flush()
                for sender_id, sender_type, content in [
                    (str(patient2.id), "user",   "Hello, I've had lower back pain for 2 weeks now. It started after I moved house."),
                    ("1234567890",     "doctor", "Hello Emma! Back pain after heavy lifting is very common. Is the pain constant or does it come and go?"),
                    (str(patient2.id), "user",   "It's worse in the morning and after sitting for long periods."),
                    ("1234567890",     "doctor", "Does the pain radiate down your leg at all?"),
                    (str(patient2.id), "user",   "Sometimes a tingling down my left leg yes."),
                    ("1234567890",     "doctor", "That could indicate some nerve involvement. I'd recommend an X-ray to rule out a slipped disc."),
                    (str(patient2.id), "user",   "That sounds scary. Is it serious?"),
                    ("1234567890",     "doctor", "It's quite common and very treatable. In the meantime take ibuprofen with food, apply heat, and avoid heavy lifting."),
                ]:
                    db.session.add(Message(chat_id=chat5.id, sender_id=sender_id, sender_type=sender_type, content=content))
                    chat5.increment_message_count()

            db.session.commit()


    return app