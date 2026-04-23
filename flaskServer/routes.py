import traceback
from datetime import datetime
from flask import request, render_template, redirect, url_for, session, Blueprint, flash, abort
from sqlalchemy import text
from flaskServer import db
from flaskServer.models import (
    Message, Notification, Request, User, Doctor, Decypher, Chat,
    Review, Report, ModeratorNotification,
    CHAT_STATUS_ACTIVE, CHAT_STATUS_WITHDRAWN, CHAT_STATUS_CLOSED,
    REQUEST_STATUS_PENDING, REQUEST_STATUS_ACCEPTED, REQUEST_STATUS_REJECTED,
)
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
    json = data.get_json();
    
    user = json.get("username") # whatever it is, its all dependent on the field type.. and then we can manually set up a form so, we set up a manual form 
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
    if 'user' not in session:
        return None
    return User.query.filter_by(username=session['user']).first()

def get_current_doctor():
    """Return the logged-in Doctor object from the session, or None.

    Returns:
        Doctor | None: the Doctor matching session['user'], or None.
    """
    if session.get('role') != 'doctor':
        return None
    return Doctor.query.filter_by(username=session['user']).first()



@main.route('/')
def home():
    #i Doubt we would need a home directory or navigator per se, i think the approach that i have taken at least we should not return any headers, only json data.
    logger.info(sanitisationForLogs(f"Request from the address {request.remote_addr}"))
    #return json objects instead, in my opinion because I think due to my personal naivety i imagined we would navigate across pages, which is not right.
    return jsonify({"status" : 200})
    #return render_template('home.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    """Login route is responsible for authenticating patient (user) accounts.
    On a successful login the user's username, role, and encrypted bio are stored
    in the session and the user is redirected to their dashboard.

    Returns:
        renders login.html on GET or failed POST, redirects to user_dashboard on success.
    """

    error = None
    forms = validation_form()
    
    if request.method == 'POST':
        if forms.validate_on_submit():
            session.permanent = True
            username = forms.username.data
            password = forms.password.data
            
            query = text("SELECT * FROM user WHERE username = :username")
            row = db.session.execute(query, {"username": username}).mappings().first()

            if row is None:
                flash("no such account exists")
                error = "No user with that name exists."
                logging.warning(f"warning, ")
                return render_template('login.html', forms=forms, error=error)

            user = db.session.get(User, row['id'])
            session.clear()

            if user.is_banned:
                flash('Your account has been banned.')
                logging.warning(sanitisationForLogs(f"Banned user {username} attempted to log in from {request.remote_addr}"))
                return render_template('login.html', forms=forms, error="Your account is banned.")
            
            if user.is_suspended:
                flash(f'Your account is suspended. Reason: {user.suspension_reason}')
                logging.warning(sanitisationForLogs(f"Suspended user {username} attempted to log in from {request.remote_addr}. Reason: {user.suspension_reason}"))
                return render_template('login.html', forms=forms, error="Your account is suspended.")

            if not user.check_hash(password):
                flash('Login credentials are invalid, please try again')
                logging.warning(sanitisationForLogs(f"Incorrect credentials for username: {username} from the address: {request.remote_addr}"))
                return render_template('login.html', forms=forms)
            
            session['user']    = user.username
            session['role']    = user.role
            session['bio']     = user.bio
            session['user_id'] = user.id
            logger.info(sanitisationForLogs(f"user logged in with the name: {user.username} from {request.remote_addr}"))
            return redirect(url_for('main.user_dashboard'))
    
        else:
            logger.error(sanitisationForLogs(f"incorrect submission from attempt from the address {request.remote_addr}"))
            return jsonify({"status" : 400, "message" : "suspicious attempt"})

    return render_template('login.html', forms=forms, error=error)


@main.route('/dashboard')
def dashboard():
    """Dashboard route redirects logged-in users to their role-appropriate dashboard.
    Users go to /user-dashboard and doctors go to /doctor/dashboard.

    Returns:
        redirects to the correct dashboard based on session role,
        or to the login page if not logged in.
    """
    role = session.get('role')
    if role == 'user':
        return redirect(url_for('main.user_dashboard'))
    elif role == 'doctor':
        return redirect(url_for('main.doctor_dashboard'))
    return redirect(url_for('main.login'))



@main.route('/register', methods=['GET', 'POST'])
def register():
    """Register route is responsible for creating new patient (user) accounts.
    The role is always set to 'user'. Bio is sanitised with bleach before
    being encrypted and stored.

    Returns:
        renders register.html on GET or failed POST, redirects to login on success.
    """
    data = request.get_json()
    
    forms = registration_form()
    if request.method == 'POST':
        
        if forms.validate_on_submit():
            session.permanent = True
            username      = forms.username.data
            password      = forms.password.data
            bio           = forms.bio.data
            first_name    = forms.first_name.data
            last_name     = forms.last_name.data
            date_of_birth = forms.date_of_birth.data
            location      = forms.location.data
            role          = "user"
            
            logging.info(sanitisationForLogs(f"forms validated during registration for the user: {username} from the ip {request.remote_addr} "))

            check_query = text("SELECT username FROM user WHERE username = :username")
            result = db.session.execute(check_query, {"username": username})
            row = result.first()

            session.clear()
            if row:
                flash('There already is a user registered with that username... \n Please register with a different username.')
                logging.info(sanitisationForLogs(f"user tried to create an account with the username {username} from the ip {request.remote_addr} "))
                return jsonify({"success" : False,"message" : "The name is taken."})

            safe_bio = bleach.clean(bio, 
                                 tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                                 attributes={'a' : ['href', 'title']},
                                 strip=True)

            db_user = User(
                username=username, password=password, role=role, bio=safe_bio,
                first_name=first_name, last_name=last_name,
                date_of_birth=date_of_birth, location=location
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

            logging.info(sanitisationForLogs(f"user has been registered with the name {username} from the ip {request.remote_addr}"))
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


@main.route('/user-dashboard', methods = ["POST"])
def user_dashboard():
    """User dashboard shows the patient's active requests and points total.

    Returns:
        renders user_dashboard.html with request and profile data.
    """
    try:
        if session.get('role') != 'user':
            logger.warning(sanitisationForLogs(f"Forbidden access attempt: role={session.get('role')}"))
            return render_template("forbidden.html", message="you need to be logged in to view this page"), 403

        user = get_current_user()
        pending_requests  = Request.query.filter_by(user_id=user.id, status=REQUEST_STATUS_PENDING).all()
        accepted_requests = Request.query.filter_by(user_id=user.id, status=REQUEST_STATUS_ACCEPTED).all()

        return render_template(
            'user_dashboard.html',
            username=user.username,
            first_name=user.first_name,
            points=user.points,
            pending_requests=pending_requests,
            accepted_requests=accepted_requests,
        )
    except InvalidToken:
        return jsonify({"status", 400}), 400


@main.route('/doctor/login', methods=['GET', 'POST'])
def doctor_login():
    """Doctor login route is responsible for authenticating doctor accounts.
    On a successful login the doctor's username, role, NHS number, and encrypted
    bio are stored in the session and the doctor is redirected to the doctor dashboard.

    Returns:
        renders doctor_login.html on GET or failed POST, redirects to doctor_dashboard on success.
    """
    error = None
    forms = validation_form()
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
                return render_template('doctor_login.html', forms=forms, error="Your account is suspended.")

            if row is None:
                flash("No doctor account with that email exists.")
                error = "No doctor with that email exists."
                logger.warning(sanitisationForLogs(f"Failed doctor login for unknown user from {request.remote_addr}"))
                return render_template('doctor_login.html', forms=forms, error=error)

            doctor = db.session.get(Doctor, row['nhs_number'])
            session.clear()

            if not doctor.check_password(password):
                flash('Login credentials are invalid, please try again.')
                logger.warning(sanitisationForLogs(f"Incorrect password for doctor: {username} from {request.remote_addr}"))
                return render_template('doctor_login.html', forms=forms)

            session['user']       = doctor.username
            session['role']       = doctor.role
            session['bio']        = doctor.bio
            session['nhs_number'] = doctor.nhs_number
            session['user_id']    = doctor.nhs_number
            logger.info(sanitisationForLogs(f"Doctor logged in: {doctor.username} from {request.remote_addr}"))
            return redirect(url_for('main.doctor_dashboard'))

        else:
            logger.error(sanitisationForLogs(f"Invalid doctor login form submission from {request.remote_addr}"))
            return render_template('doctor_login.html', forms=forms)

    return render_template('doctor_login.html', forms=forms, error=error)


@main.route('/doctor/register', methods=['GET', 'POST'])
def doctor_register():
    """Doctor register route is responsible for creating new doctor accounts.
    The role is always set to 'doctor'. Bio is sanitised with bleach before
    being encrypted and stored.

    Returns:
        renders doctor_register.html on GET or failed POST, redirects to doctor_login on success.
    """
    forms = DoctorRegistrationForm()
    if request.method == 'POST':
        if forms.validate_on_submit():
            nhs_number    = forms.nhs_number.data
            first_name    = forms.first_name.data
            last_name     = forms.last_name.data
            username      = forms.username.data
            password      = forms.password.data
            date_of_birth = forms.date_of_birth.data
            location      = forms.location.data
            specialty     = forms.specialty.data
            language      = forms.language.data
            bio           = forms.bio.data
            availability  = forms.availability.data

            logger.info(sanitisationForLogs(f"Doctor registration attempt for {username} from {request.remote_addr}"))

            nhs_check = text("SELECT nhs_number FROM doctor WHERE nhs_number = :nhs_number")
            if db.session.execute(nhs_check, {"nhs_number": nhs_number}).first():
                flash('A doctor with that NHS number is already registered.')
                return render_template('doctor_register.html', forms=forms)

            username_check = text("SELECT username FROM doctor WHERE username = :username")
            if db.session.execute(username_check, {"username": username}).first():
                flash('A doctor with that email is already registered.')
                return render_template('doctor_register.html', forms=forms)

            session.clear()

            safe_bio = bleach.clean(bio,
                                    tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                                    attributes={'a': ['href', 'title']},
                                    strip=True)

            db_doctor = Doctor(
                nhs_number=nhs_number, first_name=first_name, last_name=last_name,
                username=username, password=password, date_of_birth=date_of_birth,
                location=location, specialty=specialty, language=language,
                bio=safe_bio, availability=availability
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

            logger.info(sanitisationForLogs(f"Doctor registered: {username} from {request.remote_addr}"))
            return redirect(url_for('main.doctor_login'))
        else:
            return render_template('doctor_register.html', forms=forms)

    return render_template('doctor_register.html', forms=forms)


@main.route('/doctor/dashboard')
def doctor_dashboard():
    """Doctor dashboard shows active chat count, pending requests, and profile info.

    Returns:
        renders doctor_dashboard.html if the session role is 'doctor', 403 otherwise.
    """
    if session.get('role') != 'doctor':
        logger.warning(sanitisationForLogs(f"Forbidden access to doctor dashboard: role={session.get('role')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to view this page."), 403
    try:
        doctor = get_current_doctor()
        decypher = Decypher(session['bio'])

        active_chats     = Chat.query.filter_by(receiver_id=doctor.nhs_number, status=CHAT_STATUS_ACTIVE).all()
        pending_requests = Request.query.filter_by(status=REQUEST_STATUS_PENDING).all()

        return render_template(
            'doctor_dashboard.html',
            username=doctor.username,
            first_name=doctor.first_name,
            bio=decypher.get_text(),
            specialty=doctor.specialty,
            rating=doctor.rating,
            active_chat_count=len(active_chats),
            pending_requests=pending_requests,
        )
    except InvalidToken:
        return redirect(url_for('main.doctor_login'))

@main.route('/change-password', methods=['GET', 'POST'])
def change_password():
    """Change password route allows both users and doctors to update their password.
    It checks the session role to determine which table and password method to use.

    Returns:
        renders change_password.html on GET or failed POST, redirects to dashboard on success.
    """
    if request.method == 'POST':
        
        if 'user' not in session:
            logger.warning(sanitisationForLogs(f"user has tried to change the password without being logged in from the ip address {request.remote_addr}"))
            return render_template("forbidden.html", message="you need to be logged in to view this page."), 403 
        
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
                    return render_template('change_password.html', form=form)
                account          = db.session.get(Doctor, row['nhs_number'])
                password_correct = account.check_password(current_password) if account else False
            else:
                query   = text("SELECT * FROM user WHERE username = :username LIMIT 1")
                row     = db.session.execute(query, {"username": username}).mappings().first()
                if not row:
                    session.clear()
                    return render_template('change_password.html', form=form)
                account          = db.session.get(User, row['id'])
                password_correct = account.check_hash(current_password) if account else False

            if not account or not password_correct:
                flash('Current password is incorrect')
                logging.warning(sanitisationForLogs(f"Incorrect current password provided for {username} from {request.remote_addr}"))
                return render_template('change_password.html', form=form)

            if new_password == current_password:
                flash('New password must be different from the current password')
                return render_template('change_password.html', form=form)

            account.set_password(new_password)
            db.session.commit()

            flash('Password changed successfully')
            return redirect(url_for('main.dashboard'))
        else:
            return render_template('change_password.html', form=form)

    return render_template('change_password.html', form=password_form())


@main.route('/logout', methods=['GET'])
def logout():
    """the logout method clears the session object, and makes the user lose the ability to acsess the funcitonality of the webiste.
    Doctors are redirected to the doctor login page, users to the standard login page.

    Returns:
        redirects to doctor_login if role was 'doctor', otherwise to login.
    """
    role = session.get('role')
    session.clear()
    if role == 'doctor':
        return redirect(url_for('main.doctor_login'))
    return redirect(url_for('main.login'))


@main.route('/filter', methods=['GET'])
def getDoctor():
    filterValues = ["location", "languange", "specialty", "gender", "min_rating"]
    if not any(key in request.args for key in filterValues):
        query = text("SELECT * FROM doctor")
        doctors = db.session.execute(query).mappings().all()
        return jsonify([dict(d) for d in doctors])
    
    filters = {}
    if request.args.get('location'):
        filters['location'] = request.args.get('location')
    if request.args.get('language'):
        filters['language'] = request.args.get('language')
    if request.args.get('specialty'):
        filters['specialty'] = request.args.get('specialty')
    if request.args.get('gender'):
        filters['gender'] = request.args.get('gender')
    if request.args.get('min_rating'):
        filters['rating'] = request.args.get('rating')
    
    query = " AND ".join(f"{filter} = :{filter}" for filter in filters)
    executeQuery = text(f"SELECT * FROM doctor WHERE {query}")
    doctors = db.session.execute(executeQuery, filters).mappings().all()
    return jsonify([dict(d) for d in doctors])


@main.route('/cases', methods=['POST'])
def caseSelector():
    caseID = request.json.get('case_id')
    action = request.json.get('action')
    
    if not caseID or action not in ('accept', 'reject'):
        return jsonify({"error": "provide a case_id and action"}), 400

    caseQuery = text("SELECT id, status FROM cases WHERE id = :caseID")
    result = db.session.execute(caseQuery, {"caseID": caseID}).mappings()

    if not result:
        return jsonify({"error": "case does not exist"}), 404

    if result['status'] != "open":
        return jsonify({"error": "case is already taken"}), 404

    if action == "accept":
        query = text("UPDATE cases SET status = 'claimed', doctor_username = :username WHERE id = :caseID")
        db.session.execute(query, {"username": session['user'], "caseID": caseID})
        db.session.commit()
        return jsonify({"message": "case accepted", "case_id": caseID}), 200

    if action == "reject":
        return jsonify({"message": "case skipped", "case_id": caseID}), 200



@main.route('/new-request', methods=['GET', 'POST'])
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
        return render_template("forbidden.html", message="You need to be logged in as a doctor to view this page."), 403

    pending_requests = Request.query.filter_by(status=REQUEST_STATUS_PENDING).all()
    return render_template('view_requests.html', requests=pending_requests)



@main.route('/accept-request/<int:request_id>', methods=['POST'])
def accept_request(request_id):
    """Accept request route allows a doctor to accept a pending patient request.
    A Chat is created linking the doctor and patient.

    Args:
        request_id (int): the ID of the Request to accept.

    Returns:
        redirects to the new chat on success, or back to view_requests on failure.
    """
    if session.get('role') != 'doctor':
        return render_template("forbidden.html", message="You need to be logged in as a doctor."), 403

    doctor = get_current_doctor()
    medical_request = db.session.get(Request, request_id)

    if not medical_request or medical_request.status != REQUEST_STATUS_PENDING:
        flash('Request not found or already processed.')
        return redirect(url_for('main.view_requests'))

    try:
        medical_request.status    = REQUEST_STATUS_ACCEPTED
        medical_request.doctor_id = doctor.nhs_number

        chat = Chat(
            sender_id   = medical_request.user_id,
            receiver_id = medical_request.user_id,  # doctor contact via nhs in session
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
        flash('An error occurred while accepting the request. Please try again.')
        return redirect(url_for('main.view_requests'))


@main.route('/reject-request/<int:request_id>', methods=['POST'])
def reject_request(request_id):
    """Reject request route allows a doctor to reject a pending patient request.

    Args:
        request_id (int): the ID of the Request to reject.

    Returns:
        redirects to view_requests.
    """
    if session.get('role') != 'doctor':
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to reject request {request_id} by user {session.get('user')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to perform this action."), 403
    
    try:
        medical_request = db.session.get(Request, request_id)
        if not medical_request or medical_request.status != REQUEST_STATUS_PENDING:
            flash('Request not found or already processed.')
            return redirect(url_for('main.view_requests'))
        medical_request.status = REQUEST_STATUS_REJECTED
        db.session.commit()
        flash('Request rejected successfully.')
        return redirect(url_for('main.view_requests'))
    
    except Exception as e:
        db.session.rollback()
        logger.error(sanitisationForLogs(f"Error rejecting request {request_id} for user {session.get('user')}: {str(e)}"))
        flash('An error occurred while rejecting the request. Please try again.')

    return redirect(url_for('main.view_requests'))


@main.route('/chat/<int:chat_id>', methods=['GET', 'POST'])
def chat(chat_id):
    """Chat route allows a patient and their doctor to exchange messages, images and voice uploads.

    Args:
        chat_id (int): the ID of the Chat to view.

    Returns:
        renders chat.html with the message history.
    """
    if 'user' not in session:
        return redirect(url_for('main.login'))

    chat_obj = db.session.get(Chat, chat_id)
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
    if chat_obj.status == CHAT_STATUS_ACTIVE and chat_obj.is_inactive():
        chat_obj.status = CHAT_STATUS_CLOSED
        db.session.commit()
        flash('This chat has been automatically closed due to inactivity.')

    if request.method == 'POST' and chat_obj.status == CHAT_STATUS_ACTIVE:
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



@main.route('/withdraw-chat/<int:chat_id>', methods=['POST'])
def withdraw_chat(chat_id):
    """Withdraw chat route allows a patient to withdraw from a chat within
    the first 3 user messages. FR25 — chats can be cancelled within 3 user messages.

    Args:
        chat_id (int): the ID of the Chat to withdraw from.

    Returns:
        redirects to user_dashboard.
    """
    if session.get('role') != 'user':
        return render_template("forbidden.html", message="You need to be logged in as a patient."), 403

    chat_obj = db.session.get(Chat, chat_id)
    if not chat_obj or chat_obj.sender_id != session.get('user_id'):
        flash('Chat not found.')
        return redirect(url_for('main.user_dashboard'))

    if not chat_obj.can_be_withdrawn():
        flash('This chat can no longer be withdrawn.')
        return redirect(url_for('main.chat', chat_id=chat_id))

    try:
        chat_obj.status       = CHAT_STATUS_WITHDRAWN
        chat_obj.withdrawn_at = datetime.utcnow()
        db.session.commit()
        flash('Chat withdrawn successfully.')
        logger.info(sanitisationForLogs(f"User {session.get('user')} withdrew from chat {chat_id}"))
    except Exception as e:
        db.session.rollback()
        logger.error(sanitisationForLogs(f"Error withdrawing chat {chat_id}: {str(e)}"))
        flash('An error occurred while withdrawing. Please try again.')

    return redirect(url_for('main.user_dashboard'))



@main.route('/restore-chat/<int:chat_id>', methods=['POST'])
def restore_chat(chat_id):
    """Restore chat route allows a patient to restore a withdrawn chat within 10 minutes.

    Args:
        chat_id (int): the ID of the Chat to restore.

    Returns:
        redirects to the chat or user_dashboard.
    """
    if session.get('role') != 'user':
        return render_template("forbidden.html", message="You need to be logged in as a patient."), 403

    chat_obj = db.session.get(Chat, chat_id)
    if not chat_obj or chat_obj.sender_id != session.get('user_id'):
        flash('Chat not found.')
        return redirect(url_for('main.user_dashboard'))

    if not chat_obj.can_be_restored():
        flash('This chat can no longer be restored. The 10-minute window has passed.')
        return redirect(url_for('main.user_dashboard'))

    try:
        chat_obj.status       = CHAT_STATUS_ACTIVE
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



@main.route('/review/<int:chat_id>', methods=['GET', 'POST'])
def submit_review(chat_id):
    """Submit review route allows a patient to leave a review after a chat.
    Eligibility is checked before the form is shown.

    Args:
        chat_id (int): the ID of the Chat the review relates to.

    Returns:
        renders review.html or redirects to user_dashboard.
    """
    if session.get('role') != 'user':
        return render_template("forbidden.html", message="You need to be logged in as a patient."), 403

    chat_obj = db.session.get(Chat, chat_id)
    user     = get_current_user()

    if not chat_obj or chat_obj.sender_id != user.id:
        flash('Chat not found.')
        return redirect(url_for('main.user_dashboard'))

    # FR26/FR29 — eligibility check
    if not chat_obj.user_can_review():
        flash('You are not eligible to leave a review for this chat.')
        return redirect(url_for('main.user_dashboard'))

    # prevent duplicate reviews
    existing = Review.query.filter_by(chat_id=chat_id, user_id=user.id).first()
    if existing:
        flash('You have already submitted a review for this chat.')
        return redirect(url_for('main.user_dashboard'))

    form = ReviewForm()

    if form.validate_on_submit():
        try:
            # get the doctor's nhs_number from the request linked to this chat
            linked_request = Request.query.filter_by(status=REQUEST_STATUS_ACCEPTED).filter(
                Request.user_id == user.id
            ).first()
            doctor_nhs = linked_request.doctor_id if linked_request else None

            review = Review(
                user_id   = user.id,
                doctor_id = doctor_nhs,
                chat_id   = chat_id,
                rating    = form.rating.data,
                comment   = form.content.data,
                status    = False,  # pending until moderator approves (FR13)
            )
            db.session.add(review)

            # award 5 points for submitting a review
            user.add_points(5)

            db.session.commit()
            flash('Your review has been submitted and is awaiting moderation.')
            logger.info(sanitisationForLogs(f"Review submitted by {user.username} for chat {chat_id}"))
            return redirect(url_for('main.user_dashboard'))

        except Exception as e:
            db.session.rollback()
            logger.error(sanitisationForLogs(f"Error submitting review for chat {chat_id} by {user.username}: {str(e)}"))
            flash('An error occurred while submitting your review. Please try again.')

    return render_template('review.html', form=form, chat=chat_obj)



@main.route('/delete_account', methods=['GET', 'POST'])
def delete_account():
    if request.method == "POST":

        if 'user' not in session:
            logger.warning(sanitisationForLogs(f"user has tried to delete an account without being logged in from the ip address {request.remote_addr}"))
            return render_template("forbidden.html", message="you need to be logged in to view this page."), 403 
        
        form = password_form()

        if form.validate_on_submit():
            username = session['user']
            logger.warning(sanitisationForLogs(f"Account deletion attempt for {username}"))
            current_password = form.current_password.data

            query = text("SELECT * FROM user WHERE username = :username LIMIT 1")
            row = db.session.execute(query, {"username": username}).mappings().first()

            if not row:
                session.clear()
                return render_template('delete_account.html', form=form)

            user = db.session.get(User, row['id'])

            if not user or not user.check_hash(current_password):
                flash('Current password is incorrect')
                logging.warning(sanitisationForLogs(f"Incorrect current password provided for {username} from {request.remote_addr}"))
                return render_template('delete_account.html', form=form)           

            db.session.delete(user)
            db.session.commit() 

            flash('Account Deleted Successfully!')
            session.clear()
            return redirect(url_for('main.login'))
        else:
            session.clear()
            return render_template('delete_account.html', form=form)


@main.route('/approve_review', methods=['POST'])
def approveReview():
    """Approve review route allows a moderator to approve a pending review.

    Returns:
        redirects to reviewRequest.
    """
    if session.get('role') != 'moderator':
        return render_template('forbidden.html')

    review_id = request.form.get('review_id')
    review = db.session.get(Review, review_id)
    if review:
        review.approveReview()
        db.session.commit()

    return redirect(url_for('main.reviewRequest'))


@main.route('/requestAppointment', methods=['POST'])
def requestAppointment():
    """Request appointment route submits a medical request from a patient.

    Returns:
        redirects to dashboard.
    """
    if 'user_id' not in session:
        return render_template('forbidden.html')

    request_obj = Request(
        age = request.form.get('age'),
        symptoms = request.form.get('symptoms'),
        symptoms_details = request.form.get('symptoms_details'),
        family_issues = bool(request.form.get('family_issues')),
        family_details = request.form.get('family_details'),
        existing_issues = bool(request.form.get('existing_issues')),
        existing_details = request.form.get('existing_details'),
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

    return redirect(url_for('main.reviewRequest'))


@main.route('/reportChat', methods=['POST'])
def reportChat():
    """Report chat route allows a user to report a specific message.

    Returns:
        redirects back to the referring page.
    """
    if 'user' not in session:
        return render_template('forbidden.html')

    message_id = request.form.get('message_id')
    reason = request.form.get('reason')

    if not reason or len(reason) > 2000:
        flash("Reason must be between 1 and 2000 characters")
        return redirect(request.referrer)

    report = Report(
        message_id  = message_id,
        reporter_id = session['user_id'],
        reason = reason
    )

    db.session.add(report)
    db.session.commit()

    flash("Report submitted successfully")
    return redirect(request.referrer)


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
    return render_template('search_results.html', doctors=results)

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

    return redirect(url_for('main.reviewRequest'))
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

    return redirect(url_for('main.reviewRequest'))

@main.route('/edit_review/<int:review_id>', methods=['GET', 'POST'])
def edit_review(review_id):
    """Edit review route allows a user to edit a pending review within five minutes of submission.

    Args:
        review_id (int): the ID of the Review to edit.

    Returns:
        renders edit_review.html or redirects to user_dashboard.
    """
    if session.get('role') != 'user':
        return render_template("forbidden.html", message="You need to be logged in as a patient."), 403

    review = db.session.get(Review, review_id)
    user = get_current_user()

    if not review or review.user_id != user.id:
        flash('Review not found.')
        return redirect(url_for('main.user_dashboard'))
    
    time_limit = review.created_at + timedelta(minutes=5)

    if datetime.utcnow() > time_limit:
        flash('The edit window for this review has expired.')
        return redirect(url_for('main.user_dashboard'))
    
    form = ReviewForm(obj=review)

    if form.validate_on_submit():
        try:
            review.rating = form.rating.data
            review.comment = form.content.data
            db.session.commit()
            flash('Your review has been updated.')
            logger.info(sanitisationForLogs(f"Review {review_id} edited by {user.username}"))
            return redirect(url_for('main.user_dashboard'))
        except Exception as e:
            db.session.rollback()
            logger.error(sanitisationForLogs(f"Error editing review {review_id} by {user.username}: {str(e)}"))
            flash('An error occurred while updating your review. Please try again.')
            
    return redirect(url_for('main.user_dashboard'))

@main.route('/notifications', methods=['GET'])
def get_notifications():
    if session.get('role') != 'user':
        return render_template("forbidden.html", message="You need to be logged in as a patient."), 403

    user = get_current_user()
    user_notifications = Notification.query.filter_by(user_id=user.id).all()

    return render_template('notifications.html', notifications=user_notifications)