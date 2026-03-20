from datetime import datetime

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

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), default='user', nullable=False)
    bio = db.Column(db.String(3000), nullable=False)

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
    


        
    def __init__(self, username, password, role, bio):
        """Constructor for creating the user object, when initialised the passwords are hashed and used as comparison objects and biographies are encrypted via secret key;"""
        self.username = username
        self.password = self.hash_password(password)
        self.role = role
        #need to do hashing here
        self.bio = self.encrypt_bio(bio)

    def set_password(self, password):
        """ Password setter

        Args:
            password (_type_): if a user changes hte password then it is set to a different one, and a corresponding hash is generated to the new log
        """        
        self.password = self.hash_password(password)

    
    def set_role(self, role):
        """A role setter

        Args:
            role (string): a setter for the logged in person, trying to log in;
        """        
        roles = ["patient", "doctor", "admin"]
        if role not in roles:
            self.role = "user"
        else: 
            self.role = role

    def set_bio(self, bio):
        self.bio = self.encrypt_bio(bio)

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

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey('chat.id'),nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)