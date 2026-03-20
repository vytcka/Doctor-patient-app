from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField,TextAreaField, IntegerField, SubmitField, BooleanField
from wtforms.validators import NumberRange, Optional, input_required, Length, ValidationError, Email
from flask  import session

    
blockedList = {"root", "admin", "superuser"}
common_list = ["Password123$","Qwerty123$", "Adminadmin1@", "welcome", "weLcome123!"]

def repeating(input:str)->bool:
    """repeating function checks whether there are repeatable charachters in the string.

    Args:
        input (String): NON-NULL string input parameter. 

    Returns:
        bool: returns true if there are 3 consequtive charachters which are the same, if not False"""
        
    arr = [char for char in input]
    counter = 1
    current_char = arr[0]


    for i in range(len(arr)):
        if(current_char == arr[i]):
            counter += 1
            if(counter == 3):
                return True
        else: 
            current_char = arr[i]
            counter = 1
    return False


#change password - then login - then registration for forms; but maybe seperate is si

class validation_form(FlaskForm):
    """Validation_form class is responsible for defining the fields and providing validators for those fields, the validation class is utilised for login.
    Args:
        FlaskForm (Parent Class): uses the flaskform parent class to instantiate the forms object containing the the validated fields.

    Raises:
        ValidationError: if the inputs do not correspond to the length of the instantiated class attributes or the validation forms, it results in raising validation error.
    """    

    username = StringField('Username' ,validators=[input_required(message= "there has to be data within the username field"), 
                                        Email(message="The username has to be a valid email address."),
                                        Length(min=6, max= 40, message= "The username has to be between 6 and 40 charachters in length")])

    password = PasswordField('Password' , validators=[input_required(message="The password cannot be empty"),
                                          Length(min = 10, max= 40, message= "there password has to be between 6 and 40 chars in length")])
    
    def validate_username(self, username)->None:
        if username.data in blockedList:
            raise ValidationError("Cannot register with privelaged names")


    def validate_password(self, password)-> None:
        """Password validatoer is responsible for making sure the password conforms with the programs standard. 

        Args:
            password (String): takes it from the request, and processes here to make sure its not common and etc. 

        Raises:
            ValidationError: Validation error is raised when it does not meet one of the standards.
        """        
        #checking if name is blacklisted;
        
        if password.data in common_list:
            raise ValidationError("The password is too common. Please change it to a less common password.")
        #doing checks 
        if not any(charac.isdigit() for charac in password.data):
            raise ValidationError("There has to be at least a digit stored in the password.")
        if self.username.data in password.data:
            raise ValidationError("The password cannot contain the username and the password.")
        if not any(charac.isupper() for charac in password.data):
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not any(charac.islower() for charac in password.data):
            raise ValidationError("Password must contain at least one lowercase letter.")
        if not any(not charac.isalnum() for charac in password.data):
            raise ValidationError(" There has to be at least a singular special charachter within the password.")
        #part B; checking for repeating charachters;
        if(repeating(password.data)):
            raise ValidationError("There cannot be 3 consequtive repeating charachters in the password ")
        
            
        
class registration_form(validation_form):
    """registration_form is a child class of the validation class but this time it is used for registration of accounts since there is one more field during registration.
    Args:
        validation_form (parent class): inheriting the parent class for account registration;
    """    
    bio = TextAreaField('Biography',validators=[Length(min = 20, max = 500, message= "The biography bit has to be between 20 and 500 charachters" ),
                            input_required(message="There has to be some data within the biography")])
    
class password_form(FlaskForm):
    """Password form is used when resetting the account password.

    Args:
        FlaskForm (Parent Class): uses the flaskform parent class to instantiate the forms object containing the the validated fields.

    Raises:
        ValidationError: Validation error is raised when it does not meet one of the standards.
    """    
    current_password = PasswordField('Current password' , validators=[input_required(message="The password cannot be empty"),
                                          Length(min = 10, max= 40, message= "the current password has to be between 6 and 40 chars in length")])
    new_password = PasswordField('New password' , validators=[input_required(message="The repeated password cannot be empty"),
                                          Length(min = 10, max= 40, message= "the new password has to be between 6 and 40 chars in length")])
        
    def validate_new_password(self, new_password):
        """
        the function validate_new_password checks whether the password conforms to the standard
        Args:
            new_password (String): string input of the new password

        Raises:
            ValidationError: the validate_new_password raises an issue only when the password does not conform to the standards below.
        """  
        username = session.get('user')      
        if new_password.data in common_list:
            raise ValidationError("The password is too common. Please change it to a less common password.")
        #doing checks 
        if not any(charac.isdigit() for charac in new_password.data):
            raise ValidationError("There has to be at least a digit stored in the new password.")
        if not any(charac.isupper() for charac in new_password.data):
            raise ValidationError("New password must contain at least one uppercase letter.")
        if not any(charac.islower() for charac in new_password.data):
            raise ValidationError("New Password must contain at least one lowercase letter.")
        if not any(not charac.isalnum() for charac in new_password.data):
            raise ValidationError(" There has to be at least a singular special charachter within the new password.")
        if username in new_password.data:
            raise ValidationError("The password cannot contain the username and the password.")
        #part B; checking for repeating charachters;
        if(repeating(new_password.data)):
            raise ValidationError("There cannot be 3 consequtive repeating characters in the new password ")

    
class request_form(FlaskForm):
    """Request form is used for submitting a medical request, users fill out a health questionnaire and submit it to the doctor, the doctor then can view the request and decide whether to accept or reject it.

    Args:
        FlaskForm (Parent Class): uses the flaskform parent class to instantiate the forms object containing the the validated fields.

    Raises:
        ValidationError: Validation error is raised when it does not meet one of the standards.
    """
    age = IntegerField("Age:", validators=[input_required(message="Age cannot be empty"), 
                                           NumberRange(min=0, max=120, message="Age has to be between 0 and 120")])
    symptoms = TextAreaField("What are your current symptoms?", validators=[input_required(message="There has to be some data within the symptoms field"), 
                                        Length(min=10, max=1000, message="The symptoms field has to be between 10 and 1000 characters in length")])
    symptoms_details = TextAreaField("Please provide more details about your symptoms:", validators=[input_required(message="There has to be some data within the symptoms details field"),
                                                                                                   Length(min=10, max=1000, message="The symptoms details field has to be between 10 and 1000 characters in length")])
    family_issues = BooleanField("Do you have any family history of medical conditions?", validators=[input_required(message="There has to be some data within the family issues field")])
    family_details = TextAreaField("Please provide more details about your family's medical history:", validators=[Optional()])
    submit = SubmitField("Submit Request")