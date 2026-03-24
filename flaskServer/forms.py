from flask_wtf import FlaskForm
from wtforms import (StringField, PasswordField, TextAreaField, IntegerField,
                     SubmitField, BooleanField, SelectField, FloatField, DateField)
from wtforms.validators import NumberRange, Optional, input_required, Length, ValidationError, Email
from flask import session
from datetime import date
from flaskServer.models import VALID_SPECIALTIES

    
blockedList = {"root", "admin", "superuser"}
common_list = ["Password123$","Qwerty123$", "Adminadmin1@", "welcome", "weLcome123!"]
MAX_AGE_YEARS = 100

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
    """registration_form is a child class of the validation class used for registering
    new patient (user) accounts. It adds biography and patient identity fields on top
    of the login credentials inherited from validation_form.

    Args:
        validation_form (parent class): inheriting the parent class for account registration.

    Raises:
        ValidationError: raised if any field fails its validation rules.
    """

    bio = TextAreaField('Biography',validators=[Length(min = 20, max = 500, message= "The biography bit has to be between 20 and 500 charachters" ),
                            input_required(message="There has to be some data within the biography")])

    # new patient identity fields
    first_name = StringField('First name', validators=[
        input_required(message="First name is required."),
        Length(min=2, max=50, message="First name must be between 2 and 50 characters."),
    ])

    last_name = StringField('Last name', validators=[
        input_required(message="Last name is required."),
        Length(min=2, max=50, message="Last name must be between 2 and 50 characters."),
    ])

    date_of_birth = DateField('Date of birth', validators=[
        input_required(message="Date of birth is required."),
    ])

    location = StringField('Location', validators=[
        input_required(message="Location is required."),
        Length(min=2, max=100, message="Location must be between 2 and 100 characters."),
    ])

    def validate_first_name(self, first_name):
        """Validate first name checks that the first name only contains characters
        expected in a real name, rejecting digits and symbols.

        Args:
            first_name (String): the first name value submitted from the registration form.

        Raises:
            ValidationError: raised if the first name contains invalid characters.
        """
        allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -'")
        if not all(c in allowed for c in first_name.data):
            raise ValidationError("First name may only contain letters, spaces, hyphens, or apostrophes.")

    def validate_last_name(self, last_name):
        """Validate last name checks that the last name only contains characters
        expected in a real name, rejecting digits and symbols.

        Args:
            last_name (String): the last name value submitted from the registration form.

        Raises:
            ValidationError: raised if the last name contains invalid characters.
        """
        allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -'")
        if not all(c in allowed for c in last_name.data):
            raise ValidationError("Last name may only contain letters, spaces, hyphens, or apostrophes.")

    def validate_date_of_birth(self, date_of_birth):
        """Validate date of birth checks that the submitted date is a plausible date
        of birth, rejecting future dates and dates implying an age over 100 years.

        Args:
            date_of_birth (Date): the date of birth value submitted from the registration form.

        Raises:
            ValidationError: raised if the date is in the future or implies an age over 100 years.
        """
        if date_of_birth.data is None:
            return
        today = date.today()
        if date_of_birth.data > today:
            raise ValidationError("Date of birth cannot be in the future.")
        age_years = (today - date_of_birth.data).days / 365.25
        if age_years > MAX_AGE_YEARS:
            raise ValidationError(f"Date of birth implies an age over {MAX_AGE_YEARS} years, which is not valid.")

    def validate_location(self, location):
        """Validate location checks that the location field is not filled with only
        whitespace, which would pass input_required but be meaningless.

        Args:
            location (String): the location value submitted from the registration form.

        Raises:
            ValidationError: raised if the location contains only whitespace characters.
        """
        if location.data and location.data.strip() == "":
            raise ValidationError("Location cannot be blank.")


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
        if username and username in new_password.data:
            raise ValidationError("The password cannot contain the username.")    
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



class DoctorRegistrationForm(FlaskForm):
    """DoctorRegistrationForm is responsible for collecting and validating all
    fields required to register a new doctor account, including NHS number,
    specialty, language, availability, and rating in addition to the standard
    identity and login credential fields.

    Args:
        FlaskForm (Parent Class): uses the FlaskForm parent class to instantiate
        the form object.

    Raises:
        ValidationError: raised if any field fails its validation rules.
    """

    first_name = StringField('First name', validators=[
        input_required(message="First name is required."),
        Length(min=2, max=50, message="First name must be between 2 and 50 characters."),
    ])
    last_name = StringField('Last name', validators=[
        input_required(message="Last name is required."),
        Length(min=2, max=50, message="Last name must be between 2 and 50 characters."),
    ])
    username = StringField('Username (e-mail)', validators=[
        input_required(message="Username (e-mail) is required."),
        Email(message="Username must be a valid e-mail address."),
        Length(min=6, max=80, message="Username must be between 6 and 80 characters."),
    ])
    password = PasswordField('Password', validators=[
        input_required(message="Password is required."),
        Length(min=10, max=40, message="Password must be between 10 and 40 characters."),
    ])
    nhs_number = StringField('NHS Number', validators=[
        input_required(message="NHS number is required."),
        Length(min=10, max=10, message="NHS number must be exactly 10 digits."),
    ])
    date_of_birth = DateField('Date of birth', validators=[
        input_required(message="Date of birth is required."),
    ])
    location = StringField('Location', validators=[
        input_required(message="Location is required."),
        Length(min=2, max=100, message="Location must be between 2 and 100 characters."),
    ])
    specialty = SelectField(
        'Specialty',
        choices=[(s, s) for s in VALID_SPECIALTIES],
        validators=[input_required(message="Please select a specialty.")]
    )
    language = StringField('Primary language', validators=[
        input_required(message="Language is required."),
        Length(min=2, max=60, message="Language must be between 2 and 60 characters."),
    ])
    rating = FloatField('Rating (1–5)', validators=[
        Optional(),
        NumberRange(min=1.0, max=5.0, message="Rating must be between 1.0 and 5.0."),
    ])
    availability = BooleanField('Available for appointments', default=True)
    bio = TextAreaField('Biography', validators=[
        input_required(message="Biography is required."),
        Length(min=20, max=500, message="Biography must be between 20 and 500 characters."),
    ])

    def validate_first_name(self, first_name):
        """Validate first name checks that the doctor's first name only contains
        characters expected in a real name, rejecting digits and symbols.

        Args:
            first_name (String): the first name value submitted from the doctor registration form.

        Raises:
            ValidationError: raised if the first name contains invalid characters.
        """
        allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -'")
        if not all(c in allowed for c in first_name.data):
            raise ValidationError("First name may only contain letters, spaces, hyphens, or apostrophes.")

    def validate_last_name(self, last_name):
        """Validate last name checks that the doctor's last name only contains
        characters expected in a real name, rejecting digits and symbols.

        Args:
            last_name (String): the last name value submitted from the doctor registration form.

        Raises:
            ValidationError: raised if the last name contains invalid characters.
        """
        allowed = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ -'")
        if not all(c in allowed for c in last_name.data):
            raise ValidationError("Last name may only contain letters, spaces, hyphens, or apostrophes.")

    def validate_username(self, username):
        """Validate username checks that the doctor is not registering with a
        reserved privileged name.

        Args:
            username (String): the email address submitted as the username.

        Raises:
            ValidationError: raised if the username matches a name in the blocked list.
        """
        if username.data.lower() in blockedList:
            raise ValidationError("Cannot register with a privileged username.")

    def validate_password(self, password):
        """Validate password checks that the doctor's password meets the programme's
        security standard.

        Args:
            password (String): the plain text password submitted from the doctor registration form.

        Raises:
            ValidationError: raised if the password fails any of the strength requirements.
        """
        if password.data in common_list:
            raise ValidationError("The password is too common. Please change it to a less common password.")
        if not any(charac.isdigit() for charac in password.data):
            raise ValidationError("There has to be at least a digit stored in the password.")
        if self.username.data and self.username.data in password.data:
            raise ValidationError("The password cannot contain the username.")
        if not any(charac.isupper() for charac in password.data):
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not any(charac.islower() for charac in password.data):
            raise ValidationError("Password must contain at least one lowercase letter.")
        if not any(not charac.isalnum() for charac in password.data):
            raise ValidationError("There has to be at least a singular special character within the password.")
        if repeating(password.data):
            raise ValidationError("There cannot be 3 consecutive repeating characters in the password.")

    def validate_nhs_number(self, nhs_number):
        """Validate NHS number checks that the submitted NHS number consists entirely
        of digits, since NHS numbers are always purely numeric 10-digit identifiers.

        Args:
            nhs_number (String): the NHS number value submitted from the doctor registration form.

        Raises:
            ValidationError: raised if the NHS number contains any non-digit characters.
        """
        if not nhs_number.data.isdigit():
            raise ValidationError("NHS number must contain digits only.")

    def validate_date_of_birth(self, date_of_birth):
        """Validate date of birth checks that the submitted date is a plausible date
        of birth for a practising doctor. Rejects future dates, ages over 100, and
        ages under 18.

        Args:
            date_of_birth (Date): the date of birth value submitted from the doctor registration form.

        Raises:
            ValidationError: raised if the date is invalid, implies age over 100, or under 18.
        """
        if date_of_birth.data is None:
            return
        today = date.today()
        if date_of_birth.data > today:
            raise ValidationError("Date of birth cannot be in the future.")
        age_years = (today - date_of_birth.data).days / 365.25
        if age_years > MAX_AGE_YEARS:
            raise ValidationError(f"Age cannot exceed {MAX_AGE_YEARS} years.")
        if age_years < 18:
            raise ValidationError("Doctor must be at least 18 years old.")

    def validate_specialty(self, specialty):
        """Validate specialty checks that the selected specialty is one of the
        recognised medical specialties defined in VALID_SPECIALTIES.

        Args:
            specialty (String): the specialty value selected from the dropdown.

        Raises:
            ValidationError: raised if the specialty is not in VALID_SPECIALTIES.
        """
        if specialty.data not in VALID_SPECIALTIES:
            raise ValidationError("Please select a recognised medical specialty.")

    def validate_location(self, location):
        """Validate location checks that the location field is not filled with
        only whitespace.

        Args:
            location (String): the location value submitted from the doctor registration form.

        Raises:
            ValidationError: raised if the location contains only whitespace characters.
        """
        if location.data and location.data.strip() == "":
            raise ValidationError("Location cannot be blank.")