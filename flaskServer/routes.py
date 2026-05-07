import traceback
from datetime import datetime
from flask import request, render_template, redirect, url_for, session, Blueprint, flash, abort
from sqlalchemy import text
from flaskServer import db
from flaskServer.models import (
    Message, Notification, Request, User, Doctor, Decypher, Chat,
    Review, Report, ModeratorNotification, Moderator
)
"""differrent chat statusses:  CHAT_STATUS_ACTIVE, CHAT_STATUS_WITHDRAWN, CHAT_STATUS_CLOSED,
    REQUEST_STATUS_PENDING, REQUEST_STATUS_ACCEPTED, REQUEST_STATUS_REJECTED"""
from flaskServer.forms import (
    request_form, validation_form, registration_form,
    password_form, DoctorRegistrationForm, ReviewForm,
)
import bleach
from cryptography.fernet import InvalidToken
from flaskServer import sanitisationForLogs
import logging
from flask import jsonify

#using fernet lib to provide symmetrical encryption

#Ensure passwords are stored using a strong, one way hashing approach.
#bcrypt.generate_password_hash


#use hashing via bcrypt and put hashed valeus in the db, and then hash the input with the same salt and compare them, if equal then give out token;




""" Quick note for the backend people, we have been focusing on the wrong aspect of developed as i have mentioned.
So a proposed solution would be to send json data rather then direct redirection. so for example
@main.route("/certain_path", methods = ["POST"]): #also methods should be post, to send the data
def certainMethod():
    #lets say we get a variable user, we capture it via the api call to capture json values:
    data = request.get_json()
    
    user = data["username"]) # whatever it is, its all dependent on the field type.. and then we can manually set up a form so, we set up a manual form 
    form = certainMethodForm()
    form.user.data = user
    
    if form.validate():
        ...
        #now depending on the method we either return data or a status or both :D
        return jsonify({"status" : 200}), 200
    else:
        return jsonify({"status" : 400}), 400
    
"""

main = Blueprint('main', __name__)
logger = logging.getLogger()


def get_current_user():
    """Return the logged-in User object from the session, or None.

    Returns:
        User | None: the User matching session['user'], or None.
    """
    data = request.get_json()

    if data is None:
        return None
    username = data.get("username")    
    return None
    return User.query.filter_by(username=username).first()
    

def get_current_doctor():
    """Return the logged-in Doctor object from the session, or None.

    Returns:
        Doctor | None: the Doctor matching session['user'], or None.
    """
    if session.get('role') != 'doctor':
        return None
    return Doctor.query.filter_by(username=session['user']).first()



@main.route('/login', methods=['POST'])
def login():
    """Login route is responsible for authenticating patient (user) accounts.
    On a successful login the user's username, role, and encrypted bio are stored
    in the session and the user is redirected to their dashboard.

    Returns:
        renders login.html on GET or failed POST, redirects to user_dashboard on success.
    """

    error = None
    data = request.get_json()

    if not data:
        return jsonify({
            "status": 400,
            "message": "No data provided"}), 400

    username = data.get("username")
    password = data.get("password")

    forms = validation_form()
    forms.username.data = username
    forms.password.data = password

    if forms.validate_on_submit():

        query = text(
            "SELECT * FROM user WHERE username = :username"
        )

        row = db.session.execute(
            query,
            {"username": username}
        ).mappings().first()

        if row is None:
            return jsonify({
                "status": 400,
                "message": "No user with that name exists"
            }), 400

        user = db.session.get(User, row["id"])

        if user.is_banned:
            return jsonify({
                "status": 400,
                "message": "This account has been banned"
            }), 400

        if user.is_suspended:
            return jsonify({
                "status": 400,
                "message": "This account has been suspended"
            }), 400

        if not user.check_hash(password):
            return jsonify({
                "status": 400,
                "message": "Incorrect credentials"
            }), 400

        session.clear()
        session["username"] = user.username
        session.permanent = True

        return jsonify({
            "status": 200,
            "message": "Login successful"
        }), 200

    return jsonify({
        "status": 400,
        "message": "Suspicious attempt"
    }), 400

@main.route('/register', methods=['GET', 'POST'])
def register():
    """Register route is responsible for creating new patient (user) accounts.
    The role is always set to 'user'. Bio is sanitised with bleach before
    being encrypted and stored.

    Returns:
        renders register.html on GET or failed POST, redirects to login on success.
    """
    
    """user = data["username"] # whatever it is, its all dependent on the field type.. and then we can manually set up a form so, we set up a manual form 
    form = certainMethodForm()
    form.user.data = user
    
    if form.validate():"""
    data = request.get_json()
    
    forms = registration_form()
    
    forms.username.data = data["username"]
    forms.password.data = data["password"]
    forms.bio.data = data["bio"]
    forms.first_name.data = data["first name"]
    forms.last_name.data = data["last name"]
    forms.date_of_birth = data["date of birth"]
    forms.location.data = data["location"]
    
        
    if request.method == 'POST':
        
        if forms.validate_on_submit():
            session.permanent = True
            role   = "user"
            
            logging.info(sanitisationForLogs(f"forms validated during registration for the user: {forms.username.data} from the ip {request.remote_addr} "))

            check_query = text("SELECT username FROM user WHERE username = :username")
            result = db.session.execute(check_query, {"username": forms.username.data})
            row = result.first()

            session.clear()
            if row:
                flash('There already is a user registered with that username... \n Please register with a different username.')
                logging.info(sanitisationForLogs(f"user tried to create an account with the username {forms.username.data} from the ip {request.remote_addr} "))
                return jsonify({"success" : False,"message" : "The name is taken."})

            safe_bio = bleach.clean(forms.bio.data, 
                                 tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                                 attributes={'a' : ['href', 'title']},
                                 strip=True)

            db_user = User(
                username=forms.username.data, password=forms.password.data, role=role, bio=safe_bio,
                first_name=forms.first_name.data, last_name=forms.last_name.data,
                date_of_birth=forms.date_of_birth.data, location=forms.location.data
            )

            query = text("""
                INSERT INTO user (username, password, role, bio, first_name, last_name, date_of_birth, location, points)
                VALUES (:username, :password, :role, :bio, :first_name, :last_name, :date_of_birth, :location, 0)
            """)
            db.session.execute(query, {
                "username":      db_user.username,
                "password":      db_user.password,
                "role":          "user",
                "bio":           db_user.bio,
                "first_name":    db_user.first_name,
                "last_name":     db_user.last_name,
                "date_of_birth": db_user.date_of_birth,
                "location":      db_user.location,
            })
            db.session.commit()

            logging.info(sanitisationForLogs(f"user has been registered with the name {forms.username.data} from the ip {request.remote_addr}"))
            return jsonify({"success" : True}), 200
    else:
        listOfErrors = []
        for fieldName, errorMessages in forms.errors.items():
            for err in errorMessages:
                listOfErrors.append(f"{fieldName} : {err}")

        return jsonify({
            "success": False,
            "errors": listOfErrors
        })
    return jsonify({"message" : "Please input some data."})

@main.route('/moderator/login', methods=['POST'])
def moderator_login():
    """Moderator login route authenticates moderator accounts.
    On success, stores username and role in the session.
 
    Returns:
        JSON response with status and message.
    """
    data = request.get_json()
    if not data:
        return jsonify({"status": 400, "message": "No data provided"}), 400
 
    username = data.get("username")
    password = data.get("password")
 
    if not username or not password:
        return jsonify({"status": 400, "message": "Username and password are required"}), 400
 
    moderator = Moderator.query.filter_by(username=username).first()
 
    if not moderator:
        logger.warning(sanitisationForLogs(
            f"Failed moderator login for unknown user '{username}' from {request.remote_addr}"
        ))
        return jsonify({"status": 400, "message": "No moderator account with that username exists"}), 400
 
    if not moderator.check_hash(password):
        logger.warning(sanitisationForLogs(
            f"Incorrect password for moderator '{username}' from {request.remote_addr}"
        ))
        return jsonify({"status": 400, "message": "Incorrect credentials"}), 400
 
    session.clear()
    session.permanent = True
    session["user"]   = moderator.username
    session["role"]   = "moderator"
    session["mod_id"] = moderator.id
 
    logger.info(sanitisationForLogs(
        f"Moderator logged in: '{moderator.username}' from {request.remote_addr}"
    ))
    return jsonify({"status": 200, "message": "Moderator login successful"}), 200

@main.route('/doctor/login', methods=['POST'])
def doctor_login():
    """Doctor login route is responsible for authenticating doctor accounts.
    On a successful login the doctor's username, role, NHS number, and encrypted
    bio are stored in the session and the doctor is redirected to the doctor dashboard.

    Returns:
        renders doctor_login.html on GET or failed POST, redirects to doctor_dashboard on success.
    """
    error = None
    data = request.get_json()
    
    username = data["username"]

    forms = validation_form()
    forms.username.data = data["username"]
    forms.password.data = data["password"]

    session['role'] = 'doctor'
    session['username'] = data["username"]
    
    if request.method == 'POST':
        if forms.validate_on_submit():
            session.permanent = True
            username = forms.username.data
            password = forms.password.data

            query = text("SELECT * FROM doctor WHERE username = :username")
            row = db.session.execute(query, {"username": username}).mappings().first()

            if doctor.is_banned:
                flash('Your account has been banned.')
                logging.warning(sanitisationForLogs(f"Banned doctor {username} attempted to log in from {request.remote_addr}"))
                return render_template('doctor_login.html', forms=forms, error="Your account is banned.")
            
            if doctor.is_suspended:
                flash(f'Your account is suspended. Reason: {doctor.suspension_reason}')
                logging.warning(sanitisationForLogs(f"Suspended doctor {username} attempted to log in from {request.remote_addr}. Reason: {doctor.suspension_reason}"))
                return jsonify({"status" : 400, "message" : "this doctor account has been suspended"})


            if row is None:
                flash("No doctor account with that email exists.")
                error = "No doctor with that email exists."
                logger.warning(sanitisationForLogs(f"Failed doctor login for unknown user from {request.remote_addr}"))
                return jsonify({"status" : 400, "message" : "no doctor with the provided email exists"})

            doctor = db.session.get(Doctor, row['nhs_number'])
            session.clear()

            if not doctor.check_password(password):
                flash('Login credentials are invalid, please try again.')
                logger.warning(sanitisationForLogs(f"Incorrect password for doctor: {username} from {request.remote_addr}"))
                return jsonify({"status": 400, "message" : "the credentials provided are invalid"})

            session['user']       = doctor.username
            session['role']       = doctor.role
            session['bio']        = doctor.bio
            session['nhs_number'] = doctor.nhs_number
            session['user_id']    = doctor.nhs_number
            logger.info(sanitisationForLogs(f"Doctor logged in: {doctor.username} from {request.remote_addr}"))
            return jsonify({"status" : 200, "message" : f"doctor {session['user']} logged in"})

        else:
            logger.error(sanitisationForLogs(f"Invalid doctor login form submission from {request.remote_addr}"))
            return jsonify({"status" : 400, "message" : "invalid login credentials provided"})

    return jsonify ({"status" : 400, "message" : "incorrect data sending format"})


@main.route('/doctor/register', methods=[ 'POST'])
def doctor_register():
    """Doctor register route is responsible for creating new doctor accounts.
    The role is always set to 'doctor'. Bio is sanitised with bleach before
    being encrypted and stored.

    Returns:
        renders doctor_register.html on GET or failed POST, redirects to doctor_login on success.
    """
    data = request.get_json()
    forms = DoctorRegistrationForm()
    forms.nhs_number.data = data["nhs number"]
    forms.first_name.data = data["first name"]
    forms.last_name.data = data["last name"]
    forms.username.data = data["username"]
    forms.password.data = data["password"]
    forms.date_of_birth.data = data["date of birth"]
    forms.location.data = data["location"]
    forms.specialty.data = data["specialty"]
    forms.language.data = data["language"]
    forms.bio.data = data["bio"]
    forms.availability.data = data["availability"]
    
    if forms.validate_on_submit():


            logger.info(sanitisationForLogs(f"Doctor registration attempt for {forms.usernmae.data} from {request.remote_addr}"))

            nhs_check = text("SELECT nhs_number FROM doctor WHERE nhs_number = :nhs_number")
            if db.session.execute(nhs_check, {"nhs_number": forms.nhs_number.data}).first():
                return jsonify({"status" : 400, "message" : "There akready exusts a dictir with that bhs data"})

            username_check = text("SELECT username FROM doctor WHERE username = :username")
            if db.session.execute(username_check, {"username": forms.username.data}).first():
                return jsonify({"status" : 400, "message" : "That username is taken please use a different username"})

            session.clear()

            safe_bio = bleach.clean(forms.bio.data,
                                    tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                                    attributes={'a': ['href', 'title']},
                                    strip=True)

            db_doctor = Doctor(
                nhs_number=forms.nhs_number.data, first_name=forms.first_name.data, last_name=forms.last_name.data,
                username=forms.username.data, password=forms.password.data, date_of_birth=forms.date_of_birth.data,
                location=forms.location.data, specialty=forms.specialty.data, language=forms.language.data,
                bio=forms.safe_bio.data, availability=forms.availability.data
            )

            query = text("""
                INSERT INTO doctor (nhs_number, first_name, last_name, username, password, role,
                                    date_of_birth, location, specialty, language, bio, availability)
                VALUES (:nhs_number, :first_name, :last_name, :username, :password, :role,
                        :date_of_birth, :location, :specialty, :language, :bio, :availability)
            """)
            db.session.execute(query, {
                "nhs_number":    db_doctor.nhs_number,
                "first_name":    db_doctor.first_name,
                "last_name":     db_doctor.last_name,
                "username":      db_doctor.username,
                "password":      db_doctor.password,
                "role":          "doctor",
                "date_of_birth": db_doctor.date_of_birth,
                "location":      db_doctor.location,
                "specialty":     db_doctor.specialty,
                "language":      db_doctor.language,
                "bio":           db_doctor.bio,
                "availability":  db_doctor.availability,
            })
            db.session.commit()

            logger.info(sanitisationForLogs(f"Doctor registered: {db_doctor.username} from {request.remote_addr}"))
            return jsonify({"status" : 200})
    else:
        return jsonify({"status" : 400, "message" : "invalid data types provided"})


#--------------------------------------------

"""do we need this? on second thought we do"""

#--------------------------------------------


@main.route('/doctor/dashboardChats')
    #pass on the doctor nhs number and role
def doctorDashboard():
    """Doctor dashboard shows active chat count, pending requests, and profile info.

    Returns:
        renders doctor_dashboard.html if the session role is 'doctor', 403 otherwise.
    """
    data = request.get_json()


    if data['role'] != 'doctor':
        logger.warning(sanitisationForLogs(f"Forbidden access to doctor dashboard: role={session.get('role')} from {request.remote_addr}"))
        return jsonify({"status" : 400, "message" : "incorrect role provided"})
    try:
        query = text("SELECT * from Chat WHERE  doctor_nhs_number = :doctor_nhs)number")
        row = db.session.execute(query, {"doctor_nhs_number": data["nhs number"]}).mappings().first()
    except:
        return jsonify({"status" : 400, "message" : "the data is unreachable"})

    if row is not None:
            return jsonify({"status" : 200, "chats" : row})
    else:
            return jsonify({"status": 400,"message" : " no chats are available"})



@main.route('/change-password', methods=['POST'])
def change_password():
    """Change password route allows both users and doctors to update their password.
    It checks the session role to determine which table and password method to use.

    Returns:
        renders change_password.html on GET or failed POST, redirects to dashboard on success.
    """

    if session.get('role') not in ['user', 'doctor']:
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to change password by user {session.get('user')} from {request.remote_addr}"))
        return jsonify({"status" : 400, "message" : "you need to be logged in to change your password"})

    if request.method == 'POST':
           
        form = password_form() 
        
        if form.validate_on_submit():
            username = session['user']
            role = session.get('role')
            current_password = form.current_password.data
            new_password = form.new_password.data

            logger.warning(sanitisationForLogs(f"Password change attempt for {username}"))

            if role == 'doctor':
                query = text("SELECT * FROM doctor WHERE username = :username LIMIT 1")
                row = db.session.execute(query, {"username": username}).mappings().first()
                if not row:
                    session.clear()
                    return jsonify({"status" : 400, "message" : "user not found"})
                account          = db.session.get(Doctor, row['nhs_number'])
                password_correct = account.check_password(current_password) if account else False
            else:
                query   = text("SELECT * FROM user WHERE username = :username LIMIT 1")
                row     = db.session.execute(query, {"username": username}).mappings().first()
                if not row:
                    session.clear()
                    return jsonify({"status" : 400, "message" : "user not found"})
                account          = db.session.get(User, row['id'])
                password_correct = account.check_hash(current_password) if account else False

            if not account or not password_correct:
                flash('Current password is incorrect')
                logging.warning(sanitisationForLogs(f"Incorrect current password provided for {username} from {request.remote_addr}"))
                return jsonify({"status" : 400, "message" : "current password is incorrect"})

            if new_password == current_password:
                flash('New password must be different from the current password')
                return jsonify({"status" : 400, "message" : "new password must be different from the current password"})

            account.set_password(new_password)
            db.session.commit()
            return jsonify({"status" : 200, "message" : "password changed successfully"})
        else:
            return jsonify({"status" : 400, "message" : "invalid data provided"})

    return jsonify({"status" : 400, "message" : "invalid request method"})


@main.route('/logout', methods=['GET'])
def logout():
    """the logout method clears the session object, and makes the user lose the ability to acsess the funcitonality of the webiste.
    Doctors are redirected to the doctor login page, users to the standard login page.

    Returns:
        redirects to doctor_login if role was 'doctor', otherwise to login.
    """
    role = session.get('role')
    session.clear()
    return jsonify({"status" : 200, "message" : "logged out successfully, redirecting to doctor login"})



@main.route('/filter', methods=['POST'])
def getDoctor():
    logger.info("hello world1")
    data = request.get_json()
    filterValues = ["location", "language", "specialty", "gender", "min_rating"]
    if not any(key in request.args for key in filterValues):
        query = text("SELECT * FROM doctor")
        doctors = db.session.execute(query).mappings().all()
        return jsonify({ "status" : 200,"objects": [dict(d) for d in doctors]})
    try:
        logger.info("hello world2")
        filters = {}
        if data["location"]:
            filters['location'] = data["location"]
        if data["language"]:
            filters['language'] = data["language"]
        if data["specialty"]:
            filters['specialty'] = data["specialty"]
        if data["gender"]:
            filters['gender'] = data["gender"]
        if data["min_rating"]:
            filters['rating'] = data["min_rating"]

        query = " AND ".join(f"{filter} = :{filter}" for filter in filters)
        executeQuery = text(f"SELECT * FROM doctor WHERE {query}")
        doctors = db.session.execute(executeQuery, filters).mappings().all()
        return jsonify([dict(d) for d in doctors])
    except:
        return jsonify({"status":400,"objects" : "None"})


@main.route('/cases', methods=['POST'])
def caseSelector():
    name = session["username"]
    
    data = request.get_json()    
    if not data.get("caseID") or data.get("action") not in ('accept', 'reject'):
        return jsonify({"error": "provide a case_id and action"}), 400

    caseQuery = text("SELECT id, status FROM cases WHERE id = :caseID")
    result = db.session.execute(caseQuery, {"caseID": data["caseID"]}).mappings()

    if not result:
        return jsonify({"error": "case does not exist"}), 404

    if result['status'] != "open":
        return jsonify({"error": "case is already taken"}), 404

    if data["action"] == "accept":
        query = text("UPDATE cases SET status = 'claimed', doctor_username = :username WHERE id = :caseID")
        db.session.execute(query, {"username": session['user'], "caseID": data["caseID"]})
        db.session.commit()
        return jsonify({"message": "case accepted", "case_id": data["caseID"]}), 200

    if data["action"] == "reject":
        return jsonify({"message": "case skipped", "case_id": data["caseID"]}), 200



@main.route('/new-request', methods=['POST'])
def new_request():
    """New request route allows a patient to submit a health questionnaire.

    Returns:
        renders new_request.html on GET or failed POST, redirects to user_dashboard on success.
    """
    if session.get('role') != 'user':
        return render_template("forbidden.html", message="You need to be logged in as a patient."), 403

    form = request_form()
    user = get_current_user()

    if form.validate_on_submit():
        new_request = Request(
            user_id          = user.id,
            age              = form.age.data,
            symptoms         = form.symptoms.data,
            symptoms_details = form.symptoms_details.data,
            family_issues    = form.family_issues.data,
            family_details   = form.family_details.data,
        )
        try:
            db.session.add(new_request)
            db.session.commit()
            flash('Your request has been submitted successfully.')
            return redirect(url_for('main.user_dashboard'))
        except Exception as e:
            db.session.rollback()
            logger.error(sanitisationForLogs(f"Error submitting medical request for user {session.get('user')}: {str(e)}"))
            flash('An error occurred while submitting your request. Please try again.')
            return render_template('new_request.html', form=form)

    return render_template('new_request.html', form=form)

@main.route('/view-requests')
def view_requests():
    """View requests route shows all pending patient requests to a logged-in doctor.

    Returns:
        renders view_requests.html with all pending requests.
    """
    if session.get('role') != 'doctor':
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to view requests by user {session.get('user')} from {request.remote_addr}"))
        return jsonify({"status": 403, "message": "You need to be logged in as a doctor to view this page."}), 403

    approved_requests = Request.query.filter_by(status="REQUEST_STATUS_APPROVED").all()
    return jsonify({
        "status": 200,
        "requests": [
            {
                "id":               r.id,
                "user_id":          r.user_id,
                "age":              r.age,
                "symptoms":         r.symptoms,
                "symptoms_details": r.symptoms_details,
                "family_issues":    r.family_issues,
                "family_details":   r.family_details,
            }
            for r in approved_requests
        ]
    }), 200


@main.route('/moderator/pending_requests', methods=['GET'])
def moderator_pending_requests():
    """Moderator views all requests that are awaiting review.

    Returns:
        JSON list of pending requests.
    """
    if session.get('role') != 'moderator':
        return jsonify({"status": 403, "message": "You need to be logged in as a moderator"}), 403

    pending = Request.query.filter_by(status="REQUEST_STATUS_PENDING").all()
    return jsonify({
        "status": 200,
        "pending_requests": [
            {
                "id":               r.id,
                "user_id":          r.user_id,
                "age":              r.age,
                "symptoms":         r.symptoms,
                "symptoms_details": r.symptoms_details,
                "family_issues":    r.family_issues,
                "family_details":   r.family_details,
            }
            for r in pending
        ]
    }), 200


@main.route('/moderator/approve_request', methods=['POST'])
def moderator_approve_request():
    """Moderator approves a patient request so it becomes visible to doctors.

    Expected JSON body: { "request_id": <int> }

    Returns:
        JSON response with status and message.
    """
    if session.get('role') != 'moderator':
        return jsonify({"status": 403, "message": "You need to be logged in as a moderator"}), 403

    data = request.get_json()
    if not data or "request_id" not in data:
        return jsonify({"status": 400, "message": "request_id is required"}), 400

    req = db.session.get(Request, data["request_id"])
    if not req:
        return jsonify({"status": 404, "message": "Request not found"}), 404

    if req.status != "REQUEST_STATUS_PENDING":
        return jsonify({"status": 400, "message": "Request is not in a pending state"}), 400

    req.status = "REQUEST_STATUS_APPROVED"
    db.session.commit()
    logger.info(sanitisationForLogs(
        f"Moderator '{session.get('user')}' approved request {data['request_id']}"
    ))
    return jsonify({"status": 200, "message": "Request approved — now visible to doctors"}), 200


@main.route('/moderator/reject_request', methods=['POST'])
def moderator_reject_request():
    """Moderator rejects a patient request so it is never shown to doctors.

    Expected JSON body: { "request_id": <int> }

    Returns:
        JSON response with status and message.
    """
    if session.get('role') != 'moderator':
        return jsonify({"status": 403, "message": "You need to be logged in as a moderator"}), 403

    data = request.get_json()
    if not data or "request_id" not in data:
        return jsonify({"status": 400, "message": "request_id is required"}), 400

    req = db.session.get(Request, data["request_id"])
    if not req:
        return jsonify({"status": 404, "message": "Request not found"}), 404

    if req.status != "REQUEST_STATUS_PENDING":
        return jsonify({"status": 400, "message": "Request is not in a pending state"}), 400

    req.status = "REQUEST_STATUS_REJECTED"
    db.session.commit()
    logger.info(sanitisationForLogs(
        f"Moderator '{session.get('user')}' rejected request {data['request_id']}"
    ))
    return jsonify({"status": 200, "message": "Request rejected"}), 200



@main.route('/accept-request', methods=['POST'])
def accept_request(request_id):
    """Accept request route allows a doctor to accept a pending patient request.
    A Chat is created linking the doctor and patient.

    Args:
        request_id (int): the ID of the Request to accept.

    Returns:
        redirects to the new chat on success, or back to view_requests on failure.
    """
    if session.get('role') != 'doctor':
        return jsonify({"status" : 400, "message" : "you need to be logged in as a doctor to perform this action"})

    doctor = get_current_doctor()
    medical_request = db.session.get(Request, request_id)

    if not medical_request or medical_request.status != "REQUEST_STATUS_PENDING":
        return jsonify({"status" : 400, "message" : "Request not found or already processed."})

    try:
        medical_request.status    = "REQUEST_STATUS_ACCEPTED"
        medical_request.doctor_id = doctor.nhs_number

        chat = Chat(
            sender_id   = medical_request.user_id,
            receiver_id = medical_request.user_id,
        )
        db.session.add(chat)

        notification = Notification(
            user_id=medical_request.user_id,
            message=f"Your request has been accepted by Dr. {doctor.username}."
        )
        db.session.add(notification)
        db.session.commit()

        logger.info(sanitisationForLogs(f"Doctor {doctor.username} accepted request {request_id}"))
        flash('Request accepted successfully.')
        return redirect(url_for('main.chat', chat_id=chat.id))

    except Exception as e:
        db.session.rollback()
        logger.error(sanitisationForLogs(f"Error accepting request {request_id} by {session.get('user')}: {str(e)}"))
        return jsonify({"status" : 400, "message" : "An error occurred while accepting the request. Please try again."})


@main.route('/reject-request', methods=['POST'])
def reject_request(request_id):
    """Reject request route allows a doctor to reject a pending patient request.

    Args:
        request_id (int): the ID of the Request to reject.

    Returns:
        redirects to view_requests.
    """
    if session.get('role') != 'doctor':
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to reject request {request_id} by user {session.get('user')} from {request.remote_addr}"))
        return jsonify({"status" : 400, "message" : "You need to be logged in as a doctor to perform this action."}), 403

    try:
        medical_request = db.session.get(Request, request_id)
        if not medical_request or medical_request.status != "REQUEST_STATUS_PENDING":
            return jsonify({"status" : 400, "message" : "Request not found or already processed."})
        medical_request.status = "REQUEST_STATUS_REJECTED"
        db.session.commit()
        return jsonify({"status" : 200, "message" : "Request rejected successfully."})
    
    except Exception as e:
        db.session.rollback()
        logger.error(sanitisationForLogs(f"Error rejecting request {request_id} for user {session.get('user')}: {str(e)}"))
        return jsonify({"status" : 400, "message" : "An error occurred while rejecting the request. Please try again."}
        )

    return redirect(url_for('main.view_requests'))


@main.route('/chat', methods=['POST'])
def chat(chat_id):
    """Chat route allows a patient and their doctor to exchange messages, images and voice uploads.

    Args:
        chat_id (int): the ID of the Chat to view.

    Returns:
        renders chat.html with the message history.
    """
    if 'user' not in session:
        return redirect(url_for('main.login'))

    data = request.get_json()
    chat_obj = db.session.get(Chat, data["chat_id"])
    if not chat_obj:
        return render_template("forbidden.html", message="Chat not found."), 404

    role = session.get('role')

    # FR9 — only the two participants can access this chat
    if role == 'user':
        if chat_obj.sender_id != session.get('user_id'):
            logger.warning(sanitisationForLogs(f"Unauthorized chat access by user {session.get('user')} from {request.remote_addr}"))
            return render_template("forbidden.html", message="You do not have access to this chat."), 403
        sender_id   = str(session.get('user_id'))
        sender_type = 'user'
    elif role == 'doctor':
        if chat_obj.receiver_id != session.get('user_id'):
            logger.warning(sanitisationForLogs(f"Unauthorized chat access by doctor {session.get('user')} from {request.remote_addr}"))
            return render_template("forbidden.html", message="You do not have access to this chat."), 403
        sender_id   = str(session.get('nhs_number'))
        sender_type = 'doctor'
    else:
        return render_template("forbidden.html", message="You do not have access to this chat."), 403

    # FR32 — auto-close if inactive for more than 10 minutes
    if chat_obj.status == "CHAT_STATUS_ACTIVE" and chat_obj.is_inactive():
        chat_obj.status = "CHAT_STATUS_CLOSED"
        db.session.commit()
        flash('This chat has been automatically closed due to inactivity.')

    if request.method == 'POST' and chat_obj.status == "CHAT_STATUS_ACTIVE":
        if chat.withdrawn:
            #FR25 - block messaging if the chat has been withdrawn
            flash('This chat has been withdrawn. You cannot send messages.')
            return redirect(url_for('main.chat', chat_id=chat_id))
        
        content = request.form.get('content', '').strip()
        file = request.files.get('file')
        if content:
            new_message = Message(
                chat_id     = chat_id,
                sender_id   = sender_id,
                sender_type = sender_type,
                content     = content,
            )
            try:
                db.session.add(new_message)
                chat_obj.increment_message_count()

                # award 1 point to the patient for each message sent
                if sender_type == 'user':
                    patient = db.session.get(User, chat_obj.sender_id)
                    if patient:
                        patient.add_points(1)

                db.session.commit()
            except Exception as e:
                db.session.rollback()
                logger.error(sanitisationForLogs(f"Error sending message in chat {chat_id} for user {session.get('user')}: {str(e)}"))
                flash('An error occurred while sending your message. Please try again.')

    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp).all()
    return render_template('chat.html', chat=chat_obj, messages=messages)




@main.route('/restore-chat/', methods=['POST'])
def restore_chat(chat_id):
    """Restore chat route allows a patient to restore a withdrawn chat within 10 minutes.

    Args:
        chat_id (int): the ID of the Chat to restore.

    Returns:
        redirects to the chat or user_dashboard.
    """
    if session.get('role') != 'user':
        return jsonify({"status" : 400, "message" : "you need to be logged in as a patient to perform this action"})

    chat_obj = db.session.get(Chat, chat_id)
    if not chat_obj or chat_obj.sender_id != session.get('user_id'):
        return jsonify({"status" : 400, "message" : "chat not found or you do not have permission to restore this chat"})

    if not chat_obj.can_be_restored():
        return jsonify({"status" : 400, "message" : "This chat can no longer be restored. The 10-minute window has passed."})
    try:
        chat_obj.status       = "CHAT_STATUS_ACTIVE"
        chat_obj.withdrawn_at = None
        db.session.commit()
        flash('Chat restored successfully.')
        logger.info(sanitisationForLogs(f"User {session.get('user')} restored chat {chat_id}"))
        return redirect(url_for('main.chat', chat_id=chat_id))
    except Exception as e:
        db.session.rollback()
        logger.error(sanitisationForLogs(f"Error restoring chat {chat_id}: {str(e)}"))
        flash('An error occurred while restoring the chat. Please try again.')
        return redirect(url_for('main.user_dashboard'))




@main.route('/delete_account', methods=['GET', 'POST'])
def delete_account():
    if request.method == "POST":

        if 'user' not in session:
            logger.warning(sanitisationForLogs(f"user has tried to delete an account without being logged in from the ip address {request.remote_addr}"))
            return jsonify({"status" : 400, "message" : "you need to be logged in to view this page."}), 403
        
        form = password_form()

        if form.validate_on_submit():
            username = session['user']
            logger.warning(sanitisationForLogs(f"Account deletion attempt for {username}"))
            current_password = form.current_password.data

            query = text("SELECT * FROM user WHERE username = :username LIMIT 1")
            row = db.session.execute(query, {"username": username}).mappings().first()

            if not row:
                session.clear()
                return jsonify({"status" : 400, "message" : "Account not found."}), 400

            user = db.session.get(User, row['id'])

            if not user or not user.check_hash(current_password):
                flash('Current password is incorrect')
                logging.warning(sanitisationForLogs(f"Incorrect current password provided for {username} from {request.remote_addr}"))
                return jsonify({"status" : 400, "message" : "Current password is incorrect."}), 400

            db.session.delete(user)
            db.session.commit() 
            session.clear()
            return jsonify({"status" : 200, "message" : "Account deleted successfully."}), 200
        else:
            session.clear()
            return jsonify({"status" : 400, "message" : "Invalid data provided."}), 400


@main.route('/approve_review', methods=['POST'])
def approveReview():
    """Approve review route allows a moderator to approve a pending review.

    Returns:
        redirects to reviewRequest.
    """
    if session.get('role') != 'moderator':
        return jsonify({"status": 403, "message": "You need to be logged in as a moderator to perform this action"}), 403

    data = request.get_json()
    if not data or "review_id" not in data:
        return jsonify({"status": 400, "message": "review_id is required"}), 400

    review = db.session.get(Review, data["review_id"])
    if not review:
        return jsonify({"status": 404, "message": "Review not found"}), 404

    review.approveReview()

    # Recalculate the doctor's average rating from all approved reviews
    approved = Review.query.filter_by(doctor_id=review.doctor_id, status=True).all()
    if approved:
        avg = round(sum(r.rating for r in approved) / len(approved), 1)
        doctor = db.session.get(Doctor, review.doctor_id)
        if doctor:
            doctor.set_rating(avg)

    db.session.commit()
    logger.info(sanitisationForLogs(
        f"Moderator '{session.get('user')}' approved review {data['review_id']}"
    ))
    return jsonify({"status": 200, "message": "Review approved successfully"}), 200


@main.route('/reject_review', methods=['POST'])
def rejectReview():
    """FR13 — Reject a pending review so it is removed without appearing on the doctor's profile.
    Only moderators may call this route.

    Returns:
        JSON response with status and message.
    """
    if session.get('role') != 'moderator':
        return jsonify({"status": 403, "message": "You need to be logged in as a moderator to perform this action"}), 403

    data = request.get_json()
    if not data or "review_id" not in data:
        return jsonify({"status": 400, "message": "review_id is required"}), 400

    review = db.session.get(Review, data["review_id"])
    if not review:
        return jsonify({"status": 404, "message": "Review not found"}), 404

    db.session.delete(review)
    db.session.commit()
    logger.info(sanitisationForLogs(
        f"Moderator '{session.get('user')}' rejected and deleted review {data['review_id']}"
    ))
    return jsonify({"status": 200, "message": "Review rejected and removed"}), 200


@main.route('/requestAppointment', methods=['POST'])
def requestAppointment():
    """Request appointment route submits a medical request from a patient.
    Returns:
        redirects to dashboard.
    """
    data = request.get_json()
    if 'user_id' not in session:
        return jsonify({"status" : 400, "message" : "you need to be logged in to view this page."}), 403

    request_obj = Request(
        age = data.get('age'),
        symptoms = data.get('symptoms'),
        symptoms_details = data.get('symptoms_details'),
        family_issues = bool(data.get('family_issues')),
        family_details = data.get('family_details'),
        existing_issues = bool(data.get('existing_issues')),
        existing_details = data.get('existing_details'),
        user_id = session['user_id']
    )

    db.session.add(request_obj)
    db.session.commit()

    flash("Appointment request submitted")
    return redirect(url_for('main.dashboard'))


@main.route('/approveAppointment', methods=['POST'])
def approveAppointment():
    """Approve appointment route allows a doctor to approve a patient request.

    Returns:
        redirects to dashboard.
    """
    if session.get('role') != 'doctor':
        return render_template('forbidden.html')

    request_id = request.form.get('request_id')
    req = db.session.get(Request, request_id)
    if req:
        req.status = 'approved'
        req.doctor_id = session['user_id']
        db.session.commit()

    flash("Appointment approved")
    return redirect(url_for('main.dashboard'))


@main.route('/reviewRequest', methods=['GET', 'POST'])
def reviewRequest():
    """Review request route shows moderators all pending reviews and reports.

    Returns:
        renders moderator_dashboard.html with pending reviews and reports.
    """
    if session.get('role') != 'moderator':
        return render_template('forbidden.html')

    pending_reviews = Review.query.filter_by(status=False).all()
    pending_reports = Report.query.filter_by(status='pending').all()

    return render_template(
        'moderator_dashboard.html',
        reviews=pending_reviews,
        reports=pending_reports
    )


@main.route('/approve_report', methods=['POST'])
def approve_report():
    """Approve report route allows a moderator to approve a pending report.

    Returns:
        redirects to reviewRequest.
    """
    if session.get('role') != 'moderator':
        return render_template('forbidden.html')

    report_id = request.form.get('report_id')
    report = db.session.get(Report, report_id)
    if report:
        report.status = 'approved'
        db.session.commit()

    return jsonify({"status" : 200, "message" : "report approved successfully"})


@main.route('/reportChat', methods=['POST'])
def reportChat():
    """Report chat route allows a user to report a specific message.

    Returns:
        redirects back to the referring page.
    """
    if 'user' not in session:
        return jsonify({"status" : 400, "message" : "you need to be logged in to view this page."}), 403

    message_id = request.form.get('message_id')
    reason = request.form.get('reason')

    if not reason or len(reason) > 2000:
        return jsonify({"status" : 400, "message" : "Reason must be between 1 and 2000 characters"}), 400

    report = Report(
        message_id  = message_id,
        reporter_id = session['user_id'],
        reason = reason)

    db.session.add(report)
    db.session.commit()

    return jsonify({"status" : 200, "message" : "report submitted successfully"})


@main.route('/filterResults', methods=['POST'])
def filterResults():
    """Filter results route returns doctors matching submitted form filters.

    Returns:
        renders search_results.html with matching doctors.
    """
    specialty = request.form.get('specialty')
    location = request.form.get('location')
    language = request.form.get('language')

    query = Doctor.query

    if specialty:
        query = query.filter_by(specialty=specialty)
    if location:
        query = query.filter(Doctor.location.ilike(f"%{location}%"))
    if language:
        query = query.filter(Doctor.language.ilike(f"%{language}%"))

    results = query.all()
    return jsonify({"status" : 200, "results" : [doctor.to_dict() for doctor in results]})

@main.route('/moderate_user', methods=['POST'])
def moderate_user():
    """Moderate user route allows a moderator to take action on a user.

    Returns:
        redirects to reviewRequest.
    """
    if session.get('role') != 'moderator':
        return render_template('forbidden.html')

    user_id = request.form.get('user_id')
    action = request.form.get('action')
    reason = request.form.get('reason')

    user = db.session.get(User, user_id)

    if user:
        if action == 'ban':
            user.is_banned = True
            user.suspension_reason = reason

        elif action == 'suspend':
            user.is_suspended = True
            user.suspension_reason = reason

        elif action == 'unban':
            user.is_banned = False
            user.suspension_reason = None

        elif action == 'unsuspend':
            user.is_suspended = False
            user.suspension_reason = None

        db.session.commit()

    return jsonify({"status" : 200, "message" : "user moderated successfully"})

@main.route('/moderate_doctor', methods=['POST'])
def moderate_doctor():
    """Moderate doctor route allows a moderator to take action on a doctor.

    Returns:
        redirects to reviewRequest.
    """
    if session.get('role') != 'moderator':
        return render_template('forbidden.html')

    nhs_number = request.form.get('nhs_number')
    action = request.form.get('action')
    reason = request.form.get('reason')

    doctor = db.session.get(Doctor, nhs_number)

    if doctor:
        if action == 'ban':
            doctor.is_banned = True
            doctor.suspension_reason = reason
            
        elif action == 'suspend':
            doctor.is_suspended = True
            doctor  .suspension_reason = reason

        elif action == 'unban':
            doctor.is_banned = False
            doctor.suspension_reason = None

        elif action == 'unsuspend':
            doctor.is_suspended = False
            doctor.suspension_reason = None

        db.session.commit()
    return jsonify({"status" : 200, "message" : "doctor moderated successfully"})

@main.route('/edit_review>', methods=['GET', 'POST'])
def edit_review(review_id):
    """Edit review route allows a user to edit a pending review within five minutes of submission.

    Args:
        review_id (int): the ID of the Review to edit.

    Returns:
        renders edit_review.html or redirects to user_dashboard.
    """
    if session.get('role') != 'user':
        return jsonify({"status" : 403, "message" : "You need to be logged in as a patient."}), 403

    review = db.session.get(Review, review_id)
    user = get_current_user()

    if not review or review.user_id != user.id:
        flash('Review not found.')
        return redirect(url_for('main.user_dashboard'))
    
    #time_limit = review.created_at + timedelta(minutes=5)

    #if datetime.utcnow() > time_limit:
     #   flash('The edit window for this review has expired.')
    #  return redirect(url_for('main.user_dashboard'))
    
    form = ReviewForm(obj=review)

    if form.validate_on_submit():
        try:
            review.rating = form.rating.data
            review.comment = form.content.data
            db.session.commit()
            logger.info(sanitisationForLogs(f"Review {review_id} edited by {user.username}"))
            return jsonify({"status" : 200, "message" : "Review updated successfully."})
        except Exception as e:
            db.session.rollback()
            logger.error(sanitisationForLogs(f"Error editing review {review_id} by {user.username}: {str(e)}"))
            return jsonify({"status" : 500, "message" : "An error occurred while updating your review. Please try again."})
            
    return redirect(url_for('main.user_dashboard'))

@main.route('/notifications', methods=['POST'])
def get_notifications():
    if session.get('role') != 'user':
        return jsonify({"status" : 403, "message" : "You need to be logged in as a patient."}), 403

    user = get_current_user()
    user_notifications = Notification.query.filter_by(user_id=user.id).all()

    return render_template('notifications.html', notifications=user_notifications)

@main.route('/submit-review', methods=['POST'])
def submit_review():
    """Submit review route allows logged-in patients to leave a review for a doctor.
    Enforces FR26 (no review after early withdrawal), FR28 (can review if reported),
    and FR29 (must have 5+ messages to review).

    Args:
        nhs_number (str): the NHS number of the doctor being reviewed.

    Returns:
        returns JSON response with success status message
    """


    if session.get('role') != 'user':
        logger.warning(sanitisationForLogs(
            f"Forbidden review attempt: role={session.get('role')} from {request.remote_addr}"
        ))
        return jsonify({"success": False, "message": "You must be logged in as a user to submit a review."}), 403

    doctor = db.session.get(Doctor, session.get('nhs_number'))
    if not doctor:
        return jsonify({"success": False, "message": "Doctor not found."}), 404

    username = session.get('user')
    user_row = db.session.execute(
        text("SELECT id FROM user WHERE username = :username"), {"username": username}).mappings().first()
    if not user_row:
        session.clear()
        return jsonify({"success": False, "message": "User not found."}), 404

    user_id = user_row['id']

    chat = Chat.query.filter_by(
        sender_id=user_id,
        doctor_nhs_number=session.get('nhs_number')).first()
    has_reported = False
    if chat:
        has_reported = Report.query.filter_by(
            reporter_id=user_id
        ).join(Message).filter(
            Message.chat_id == chat.id).first() is not None

    
    if chat and chat.early_withdrawn and not has_reported:
        logger.warning(sanitisationForLogs(
            f"User {username} attempted to review doctor {session.get('nhs_number')} "
            f"after early withdrawal from {request.remote_addr}"
        ))
        return jsonify({"success": False, "message": "You cannot review a doctor you withdrew from within 3 messages."}), 403

    
    message_count = 0
    if chat:
        message_count = Message.query.filter_by(
            chat_id=chat.id,
            sender_id=user_id
        ).count()

    if message_count < 5 and not has_reported:
        flash("You can only review a doctor after sending at least 5 messages.")
        logger.warning(sanitisationForLogs(
            f"User {username} attempted to review doctor {session.get('nhs_number')} "
            f"with only {message_count} messages from {request.remote_addr}"))
        return jsonify({"success": False, "message": "You can only review a doctor after sending at least 5 messages."}), 400

    existing_review = Review.query.filter_by(
        user_id=user_id,
        doctor_id=session.get('nhs_number')
    ).first()

    if request.method == 'POST':
        rating_raw = request.form.get('rating')
        comment = request.form.get('comment', '').strip()

        try:
            rating = float(rating_raw)
            if not (1.0 <= rating <= 5.0):
                raise ValueError
        except (TypeError, ValueError):
            return jsonify({"success": False, "message": "Rating must be a number between 1 and 5."}), 400

        safe_comment = bleach.clean(comment, tags=[], strip=True)

        if len(safe_comment) > 200:
            return jsonify({"success": False, "message": "Comment must be 200 characters or fewer."}), 400

        if existing_review:
            existing_review.rating = rating
            existing_review.comment = safe_comment
            existing_review.status = False  
            db.session.commit()
            logger.info(sanitisationForLogs(
                f"User {username} updated review for doctor {session.get('nhs_number')}"
            ))
            return jsonify({"success": True, "message": "Your review has been updated and is pending moderation."})
        else:
            new_review = Review(
                user_id=user_id,
                doctor_id=session.get('nhs_number'),
                rating=rating,
                comment=safe_comment,
                status=False
            )
            db.session.add(new_review)
            db.session.commit()
            logger.info(sanitisationForLogs(
                f"User {username} submitted review for doctor {session.get('nhs_number')}"
            ))
            return jsonify({"success": True, "message": "Your review has been submitted and is pending moderation."})

@main.route('/doctor/reviews', methods=['POST'])
def doctor_reviews():
    """Doctor reviews route displays all approved reviews for a given doctor,
    along with their current average rating.

    Anyone (logged in or not) may view this page.

    Args:
        nhs_number (str): the 10-digit NHS number of the doctor.

    Returns:
        returns a json object.
    """
    data = request.get_json()
    logger.info(f"here is the data {data}")

    if not data or "nhs_number" not in data:
        return jsonify({"status": 400, "message": "nhs_number is required"})

    obj = db.session.get(Doctor, data["nhs_number"])
    if obj is None:
        return jsonify({"status": 400, "message": "the doctor does not exist"})

    approved_reviews = Review.query.filter_by(
        doctor_id=data["nhs_number"],
        status=True
    ).order_by(Review.created_at.desc()).all()

    if approved_reviews:
        avg_rating = round(sum(r.rating for r in approved_reviews) / len(approved_reviews), 1)
    else:
        avg_rating = None

    query = text("SELECT * FROM doctors WHERE nhs_number = :nhs_number")
    results = db.session.execute(query, {"nhs_number": data["nhs_number"]}).mappings().all()

    return jsonify({
        "status": 200,
        "doctor": {
            "nhs_number": obj.nhs_number,
            "name": f"{obj.first_name} {obj.last_name}",
            "specialty": obj.specialty,
            "gender": obj.gender,
            "language": obj.language,
            "location": obj.location,
            "availability": obj.availability,
            "bio": obj._decrypt(obj.bio) if obj.bio else None, #display decrypted bio
        },
        "avg_rating": avg_rating,
        "reviews": [
            {
                "id": r.id,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at.isoformat()
            }
            for r in approved_reviews
        ]
    })

@main.route('/withdraw_chat', methods=['POST'])
def widthdraw_chat():
    """Withdraw chat route allows a doctor or patient to withdraw from an active chat,
    effectively ending the appointment. The chat is marked as withdrawn but not deleted
    to preserve conversation history for moderators in case of disputes.

    Only participants of the chat may perform this action.

    Args:
        chat_id (int): the ID of the chat to withdraw from.

    Returns:
        JSON response with success staus and message
    """
    data = request.get_json()

    if session.get('role') != 'user':
        logger.warning(sanitisationForLogs(f"Forbidden chat withdrawal attempt: role={session.get('role')} from {request.remote_addr}"))
        return jsonify({"success": False, "message": "You must be logged in as a patient to perform this action."}), 403
    
    username = session.get('user')
    user_row = db.session.execute(
        text("SELECT id FROM user WHERE username = :u"), {"u": username}).mappings().first()

    if user_row is None:
        session.clear()
        return jsonify({"success": False, "message": "User not found."}), 404

    user_id = user_row['id']
    
    chat = Chat.query.get(session.get('chat_id'))
    if not chat or chat.sender_id != user_id:
        return jsonify({"success": False, "message": "Chat not found or you do not have permissions to view this."}), 404
    #what?
    if chat.withdrawn:
        return jsonify({"success": False, "message": "Chat is already withdrawn."}), 400

    user_message_count = Message.query.filter_by(
        chat_id=session.get('chat_id'),
        sender_id=user_id
    ).count()
    
    if user_message_count >= 3:
        logger.warning(sanitisationForLogs(
            f"User {username} tried to withdraw from chat {session.get('chat_id')} "
            f"after {user_message_count} messages from {request.remote_addr}"
        ))
        return jsonify({"success": False, "message": "You can no longer withdraw from this chat."}), 400

    chat.withdraw(early=True)
    db.session.commit()

    logger.info(sanitisationForLogs(f"Chat {session.get('chat_id')} withdrawn by user {username} from {request.remote_addr}"))
    return jsonify({"success": True, "message": "You have withdrawn from the chat. The appointment is now ended."})
