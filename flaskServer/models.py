from datetime import datetime, date
 
from flaskServer import db
import bcrypt;
import os;
from cryptography.fernet import Fernet
from dotenv import load_dotenv
 
load_dotenv()
 
#part g load the secret vars;
PEPPER = os.getenv("SECRET_PEPPER")
#converting the stored value to byte string
ENCRYPTIONKEY = os.getenv("MASTER_KEY").encode('utf-8')

VALID_ROLES = ["user", "doctor"]
 
VALID_SPECIALTIES = [
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "Gastroenterology",
    "Haematology",
    "Neurology",
    "Obstetrics and Gynaecology",
    "Oncology",
    "Ophthalmology",
    "Orthopaedics",
    "Paediatrics",
    "Psychiatry",
    "Radiology",
    "Respiratory Medicine",
    "Rheumatology",
    "Surgery",
    "Urology",
]

 
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='user', nullable=False)
    bio = db.Column(db.String(3000), nullable=False)
    first_name    = db.Column(db.String(50),  nullable=False)
    last_name     = db.Column(db.String(50),  nullable=False)
    date_of_birth = db.Column(db.Date,        nullable=False)
    location      = db.Column(db.String(100), nullable=False)
 
    def hash_password(self, password:str)-> str:
        """Hash password method is responsble for hashing the methods and storing them in the database
 
        Args:
            password (str): String password is recieved as a paramater and processed via the help of bcrypt
 
        Returns:
            str: returns a encoded hash which is later used for checking to check if the password used during login is correct.
        """        
        pepperedPassword = password + PEPPER
        hash = bcrypt.hashpw(pepperedPassword.encode('utf-8'), bcrypt.gensalt(8))
        return hash.decode('utf-8')
 
    def check_hash(self, password:str) -> bool:
        """The check_hash method checks the hash of the password. the method utilises the pepper value from the enviornment to make sure that 
 
        Args:
            password (str): String input from the client user where then it is used to check whether it matches
            with the instance of the stored hash of the user in the database.
 
        Returns:
            bool: TRUE if the hashes match; FALSE if hashes don't match;
        """        
        pepperedPassword = password + PEPPER
        return bcrypt.checkpw(pepperedPassword.encode('utf-8'), self.password.encode('utf-8'))
    
    
    def encrypt_bio(self, bio:str) -> str:
        """Function encrypts the biographies and holds them encrypted in the sql alchemy instances.
 
        Args:
            bio (str): biographies themselves.
 
        Returns:
            str: returns an necrypted string in utf format since the sql alchemy instance cannot store them as a byte string instance.
        """        
        fernet = Fernet(ENCRYPTIONKEY)
        #a bytes data type, incompatible with the db
        enc_bio_bytes = fernet.encrypt(bio.encode('utf-8'))
        #conversion to a string data type, encoded in base 64
        encrypted_bio_str = enc_bio_bytes.decode('utf-8')
        #returning the encoded string
        return encrypted_bio_str
 
    def __init__(self, username, password, role, bio,
                 first_name, last_name, date_of_birth, location):
        """Constructor for creating the user object. Passwords are hashed and biographies
        are encrypted on creation. Role is validated against VALID_ROLES and defaults to
        'user' if an unrecognised value is passed.
 
        Args:
            username (String): the user's email address used as their login identifier.
            password (String): the plain text password which is hashed before being stored.
            role (String): the user's role — must be 'user' or 'doctor', defaults to 'user'.
            bio (String): a plain text biography which is encrypted before being stored.
            first_name (String): the user's first name.
            last_name (String): the user's last name.
            date_of_birth (Date): the user's date of birth as a datetime.date object.
            location (String): the user's location, e.g. a city or region.
        """
        self.username      = username
        self.password      = self.hash_password(password)
        self.role          = role if role in VALID_ROLES else "user"
        self.bio           = self.encrypt_bio(bio)
        self.first_name    = first_name
        self.last_name     = last_name
        self.date_of_birth = date_of_birth
        self.location      = location
 
    def set_password(self, password):
        """ Password setter
 
        Args:
            password (_type_): if a user changes hte password then it is set to a different one, and a corresponding hash is generated to the new log
        """        
        self.password = self.hash_password(password)
 
    def set_role(self, role):
        """A role setter. Only 'user' and 'doctor' are valid roles.
        Any other value defaults to 'user'.
 
        Args:
            role (string): the new role to assign — must be 'user' or 'doctor'.
        """        
        self.role = role if role in VALID_ROLES else "user"
 
    def set_bio(self, bio):
        self.bio = self.encrypt_bio(bio)
 
    @property
    def is_doctor(self):
        """Property that returns True if this user has the doctor role.
        Used by routes to check doctor-level access via current_user.is_doctor.
 
        Returns:
            bool: True if role is 'doctor', False otherwise.
        """
        return self.role == "doctor"


class Decypher():
    def decypher_text(self, encrptionText) -> str:
        """Decypher_text method is responsible for decyphering the actual encrypted text; we instantiate a new instance of a new class because it the constructor does not
        automatically encrypt the file

        Args:
            encrptionText (byte string): a byte string is retrieved and then decoded

        Returns:
            str: a plain password
        """        
        fernet = Fernet(ENCRYPTIONKEY)
        unencrypted = fernet.decrypt(encrptionText.encode('utf-8'))
        return unencrypted.decode('utf-8')
    
    def __init__(self, encryptionText : str):
        """utilising a seperate class for decrpytion and we decrypt it instantly in the constructor"""
        self.text = self.decypher_text(encryptionText)

    def get_text(self) -> str:
        """retrieving the decyphered biography/description

        args: Decypther class instance object: takes in since the text is automatically decrypted once the object is instantiated then it is returned
        
        returns: decyphered biography
        """
        return self.text

 
class Doctor(db.Model):
    """Doctor model represents a doctor account in the system. The role is always
    'doctor'. Passwords are hashed with bcrypt and a pepper, and biographies are
    encrypted with Fernet. The NHS number is the primary key.
    """
 
    __tablename__ = 'doctor'
 
    nhs_number    = db.Column(db.String(10),  primary_key=True, nullable=False)
    first_name    = db.Column(db.String(50),  nullable=False)
    last_name     = db.Column(db.String(50),  nullable=False)
    username      = db.Column(db.String(80),  unique=True, nullable=False)
    password      = db.Column(db.String(200), nullable=False)
    role          = db.Column(db.String(50),  default='doctor', nullable=False)
    date_of_birth = db.Column(db.Date,        nullable=False)
    location      = db.Column(db.String(100), nullable=False)
    rating        = db.Column(db.Float,       nullable=True, default=None)
    specialty     = db.Column(db.String(60),  nullable=False)
    language      = db.Column(db.String(60),  nullable=False)
    availability  = db.Column(db.Boolean,     nullable=False, default=True)
    bio           = db.Column(db.String(3000), nullable=False)
 
    def _hash_password(self, password: str) -> str:
        """Hash password method is responsible for hashing the doctor's password before
        storage. A pepper value from the environment is appended before hashing to add
        an extra layer of security on top of the bcrypt salt.
 
        Args:
            password (String): the plain text password to be hashed.
 
        Returns:
            str: a bcrypt hash string safe to store in the database.
        """
        peppered = password + PEPPER
        hashed = bcrypt.hashpw(peppered.encode('utf-8'), bcrypt.gensalt(8))
        return hashed.decode('utf-8')
 
    def check_password(self, password: str) -> bool:
        """Check password method verifies whether a plain text password matches
        the stored hash for the doctor account.
 
        Args:
            password (String): the plain text password submitted at login.
 
        Returns:
            bool: True if the password matches the stored hash, False if not.
        """
        peppered = password + PEPPER
        return bcrypt.checkpw(peppered.encode('utf-8'), self.password.encode('utf-8'))
 
    def _encrypt(self, text: str) -> str:
        """Encrypt method encrypts a plain text string using Fernet symmetric encryption
        so it is never stored as plain text in the database.
 
        Args:
            text (String): the plain text string to encrypt, typically a biography.
 
        Returns:
            str: the encrypted string as a base64 UTF-8 string safe to store in the database.
        """
        fernet = Fernet(ENCRYPTIONKEY)
        return fernet.encrypt(text.encode('utf-8')).decode('utf-8')
 
    def __init__(self, nhs_number, first_name, last_name, username, password,
                 date_of_birth, location, specialty, language, bio,
                 availability=True, rating=None):
        """Constructor for creating a Doctor object. Role is always set to 'doctor'.
        Password is hashed and bio is encrypted on creation.
 
        Args:
            nhs_number (String): the doctor's 10-digit NHS number, used as the primary key.
            first_name (String): the doctor's first name.
            last_name (String): the doctor's last name.
            username (String): the doctor's email address used as their login identifier.
            password (String): the plain text password which is hashed before storage.
            date_of_birth (Date): the doctor's date of birth as a datetime.date object.
            location (String): the location or hospital the doctor is based at.
            specialty (String): the doctor's medical specialty, must be from VALID_SPECIALTIES.
            language (String): the doctor's primary spoken language.
            bio (String): plain text biography which is encrypted before storage.
            availability (bool): whether the doctor is available for appointments, defaults to True.
            rating (Float): the doctor's rating between 1.0 and 5.0, defaults to None until rated.
        """
        self.nhs_number    = nhs_number
        self.first_name    = first_name
        self.last_name     = last_name
        self.username      = username
        self.password      = self._hash_password(password)
        self.role          = "doctor"
        self.date_of_birth = date_of_birth
        self.location      = location
        self.rating        = rating
        self.specialty     = specialty
        self.language      = language
        self.availability  = availability
        self.bio           = self._encrypt(bio)
 
    def set_password(self, new_password: str):
        """Set password setter updates the doctor's password. The new password is hashed
        before being stored so plain text is never saved.
 
        Args:
            new_password (String): the new plain text password to replace the existing one.
        """
        self.password = self._hash_password(new_password)
 
    def set_bio(self, bio: str):
        """Set bio setter updates the doctor's biography. The new biography is encrypted
        before being stored so plain text is never saved.
 
        Args:
            bio (String): the new plain text biography to replace the existing encrypted one.
        """
        self.bio = self._encrypt(bio)
 
    def set_rating(self, rating: float):
        """Set rating setter updates the doctor's rating. The value is validated to ensure
        it falls within the acceptable range before being stored.
 
        Args:
            rating (Float): the new rating value, must be between 1.0 and 5.0.
 
        Raises:
            ValueError: raised if the rating is below 1.0 or above 5.0.
        """
        if not (1.0 <= rating <= 5.0):
            raise ValueError("Rating must be between 1 and 5.")
        self.rating = round(rating, 1)
 
    def get_bio(self) -> str:
        """Get bio method decrypts and returns the doctor's biography.
 
        Returns:
            str: the decrypted plain text biography of the doctor.
        """
        fernet = Fernet(ENCRYPTIONKEY)
        return fernet.decrypt(self.bio.encode('utf-8')).decode('utf-8')
 
    @property
    def is_doctor(self):
        """Property that returns True since this model always represents a doctor.
 
        Returns:
            bool: always True.
        """
        return True


class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer, nullable=False)
    symptoms = db.Column(db.Text, nullable=False)
    symptoms_details = db.Column(db.Text)
    family_issues = db.Column(db.Boolean, default=False)
    family_details = db.Column(db.Text)
    existing_issues = db.Column(db.Boolean, default=False)
    existing_details = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    status = db.Column(db.String(20), default='pending', nullable=False)
 
    user = db.relationship('User', foreign_keys=[user_id])
    doctor = db.relationship('User', foreign_keys=[doctor_id])
 
 
# ─────────────────────────────────────────────
# Chat model — UNCHANGED
# ─────────────────────────────────────────────
 
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bookedAppointment = db.Column(db.Boolean, nullable=False, default=False)
    withdrawn = db.Column(db.Boolean, nullable=False, default=False)
    withdrawn_early = db.Column(db.Boolean, nullable=False, default=False)
    doctor_nhs_number = db.Column(db.String(10), db.ForeignKey('doctor.nhs_number'), nullable=True)

    def approveAppointment(self):
        """Approves the appointment between the patient and doctor."""

    def withdraw(self, early=False):
        """Marks the chat as withdrawn.

        Args:
            early (bool): True if withdrawn within 3 messages, blocks review (FR26).
        """
        self.withdrawn = True
        self.withdrawn_early = early
 
# ─────────────────────────────────────────────
# Message model — UNCHANGED
# ─────────────────────────────────────────────
 
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'),nullable=False)
    content = db.Column(db.Text, nullable=False)    
    timestamp = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc), nullable=False)
    
    chat = db.relationship('Chat')
    
    
class Review(db.Model):
    """The review class generates the review has to be verified and made
    sure they work, and once its verified then it will be accounted in the
    final rating"""
    
    id = db.Column(db.Integer, primary_key=True)
    status= db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.String(10), db.ForeignKey('doctor.nhs_number'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    
    user = db.relationship('User')
    doctor = db.relationship('Doctor')
    
    def approveReview(self):
        "Sets the apprved status of the review."
        self.status = True
        
        
class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=False)
    reporter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(2000), nullable=False)  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  
    
    message = db.relationship('Message')
    reporter = db.relationship('User')
    
    
class ModeratorNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255))
    seen = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)