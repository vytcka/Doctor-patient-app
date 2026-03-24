import traceback
from flask import request, render_template, redirect, url_for, session, Blueprint, flash, abort
from sqlalchemy import text
from flaskServer import db
from flaskServer.models import Message, Request, User, Decypher
from flaskServer.forms import request_form, validation_form, registration_form, password_form
import bleach
from cryptography.fernet import InvalidToken
from flaskServer import sanitisationForLogs
import logging
from flask import jsonify



#using fernet lib to provide symmetrical encryption

#Ensure passwords are stored using a strong, one way hashing approach.
#bcrypt.generate_password_hash


#use hashing via bcrypt and put hashed valeus in the db, and then hash the input with the same salt and compare them, if equal then give out token;


#Ensure that these protections are consistently applied across all relevant routes and forms. for CSRF , then the tokens 

main = Blueprint('main', __name__)
logger = logging.getLogger()

@main.route('/')
def home():
    logger.info(sanitisationForLogs(f"Request from the address {request.remote_addr}" ))
    return render_template('home.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    '''This route is responsible for logging in and checking whether the user exists that is.'''
    error = None
    forms = validation_form()
    if request.method == 'POST':
        if forms.validate_on_submit():
            #bio; we need to create a form, pass it in, and escape them in the form

            #making sure that the timer adds;
            session.permanent = True
            username = forms.username.data
            password = forms.password.data
            
            #calculate hash;
            query = text("SELECT * FROM user WHERE username = :username")
            row = db.session.execute(query, {"username": username}).mappings().first()
 
            if row is None:
                flash("no such account exists")
                error = "No user with that name exists."
                logging.warning(f"warning, ")
                return render_template('login.html', forms = forms, error = error)
            

                
            user = db.session.get(User, row['id']) 
            #clearing oldd data
            session.clear()
 
            if not user.check_hash(password):
                flash('Login credentials are invalid, please try again')
                logging.warning(sanitisationForLogs(f"Incorrect credentials for username: {username} from the address: {request.remote_addr}"))
                return render_template('login.html', forms=forms)
 
            session['user'] = user.username
            session['role'] = user.role
            session['bio']  = user.bio
            logger.info(sanitisationForLogs(f"user logged in with the name: {user.username} from {request.remote_addr}"))
            return redirect(url_for('main.user_dashboard'))
 
        else:
            logger.error(sanitisationForLogs(f"incorrect submission from attempt from the address {request.remote_addr}"))
            return render_template('login.html', forms=forms)
 
    return render_template('login.html', forms=forms, error=error)

@main.route('/dashboard')
def dashboard():
    
    if 'user' in session:
        try:
            decypher = Decypher(session['bio'])
        #now we decrypt it via the class;
            username = session['user']
            bio = session['bio']
            return render_template('dashboard.html', username=username, bio=decypher.get_text())
        
        except InvalidToken:
            return redirect(url_for('main.login'))
        
    return redirect(url_for('main.login'))

@main.route('/register', methods=['GET', 'POST'])
def register():
    forms = registration_form()
    if request.method == 'POST':
        
        if forms.validate_on_submit():
            session.permanent = True
            username = forms.username.data
            password = forms.password.data
            bio = forms.bio.data
            first_name    = forms.first_name.data
            last_name     = forms.last_name.data
            date_of_birth = forms.date_of_birth.data
            location      = forms.location.data
            role = "user"
            
            logger.info(sanitisationForLogs(f"Registration attempt for {username} from {request.remote_addr}"))
 
            check_query = text("SELECT username FROM user WHERE username = :username")
            row = db.session.execute(check_query, {"username": username}).first()
 
            session.clear()
            if row:
                flash('An account with that username already exists. Please use a different one.')
                logger.info(sanitisationForLogs(f"Duplicate registration attempt for {username} from {request.remote_addr}"))
                return render_template("register.html", forms=forms)
 
            safe_bio = bleach.clean(
                bio,
                tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                attributes={'a': ['href', 'title']},
                strip=True
            )
 
            db_user = User(
                username=username, password=password, role=role, bio=safe_bio,
                first_name=first_name, last_name=last_name,
                date_of_birth=date_of_birth, location=location
            )
 
            query = text("""
                INSERT INTO user (username, password, role, bio, first_name, last_name, date_of_birth, location)
                VALUES (:username, :password, :role, :bio, :first_name, :last_name, :date_of_birth, :location)
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
 
            logger.info(sanitisationForLogs(f"User registered: {username} from {request.remote_addr}"))
            return redirect(url_for('main.login'))
        else:
            return render_template('register.html', forms=forms)
 
    return render_template('register.html', forms=forms)


@main.route('/user-dashboard')
def user_dashboard():
    try:
        if session.get('role') != 'user':
            logger.warning(sanitisationForLogs(f"Forbidden access attempt: role={session.get('role')}"))
            return render_template("forbidden.html", message= "you need to be logged in to view this page"), 403 
        return render_template('user_dashboard.html', username=session.get('user'))
    except InvalidToken:
        return redirect(url_for('main.login'))

@main.route('/doctor/login', methods=['GET', 'POST'])
def doctor_login():
    """Doctor login route is responsible for authenticating doctor accounts.
    On a successful login the doctor's username, role, NHS number, and
    encrypted bio are stored in the session and the doctor is redirected
    to the doctor dashboard.
 
    Returns:
        renders doctor_login.html on GET or failed POST, redirects to doctor dashboard on success.
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
        renders doctor_register.html on GET or failed POST, redirects to doctor login on success.
    """
    forms = DoctorRegistrationForm()
    if request.method == 'POST':
        if forms.validate_on_submit():
            session.permanent = True
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
 
            # check NHS number not already registered
            nhs_check = text("SELECT nhs_number FROM doctor WHERE nhs_number = :nhs_number")
            if db.session.execute(nhs_check, {"nhs_number": nhs_number}).first():
                flash('A doctor with that NHS number is already registered.')
                return render_template('doctor_register.html', forms=forms)
 
            # check username not already registered
            username_check = text("SELECT username FROM doctor WHERE username = :username")
            if db.session.execute(username_check, {"username": username}).first():
                flash('A doctor with that email is already registered.')
                return render_template('doctor_register.html', forms=forms)
 
            session.clear()
 
            safe_bio = bleach.clean(
                bio,
                tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                attributes={'a': ['href', 'title']},
                strip=True
            )
 
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
    """Doctor dashboard route is the main page for logged-in doctor accounts.
    Only users with the role 'doctor' can access this page.
 
    Returns:
        renders doctor_dashboard.html if the session role is 'doctor',
        403 forbidden otherwise, redirects to doctor login if session is invalid.
    """
    if session.get('role') != 'doctor':
        logger.warning(sanitisationForLogs(f"Forbidden access to doctor dashboard: role={session.get('role')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to view this page."), 403
    try:
        decypher  = Decypher(session['bio'])
        username  = session['user']
        return render_template('doctor_dashboard.html', username=username, bio=decypher.get_text())
    except InvalidToken:
        return redirect(url_for('main.doctor_login'))

@main.route('/change-password', methods=['GET', 'POST'])
def change_password():
    if request.method == 'POST':
        
        if 'user' not in session:
            logger.warning(sanitisationForLogs(f"user has tried to change the password without being logged in from the ip address {request.remote_addr}"))
            return render_template("forbidden.html", message="you need to be logged in to view this page."), 403 
        
        
        form = password_form() 
        
        if form.validate_on_submit():
            username = session['user']
            logger.warning(sanitisationForLogs(f"Password change attempt for {username}"))
            current_password = form.current_password.data
            new_password = form.new_password.data
            
            query = text("SELECT * FROM user WHERE username = :username LIMIT 1")
            row = db.session.execute(query, {"username" : username}).mappings().first()

            if not row:
                session.clear()
                return render_template('change_password.html', form=form)

            
            user = db.session.get(User, row['id'])

            # Validating that the current pass is correct
            if not user or not user.check_hash(current_password):
                flash('Current password is incorrect')
                logging.warning(sanitisationForLogs(f"Incorrect current password provided for {username} from {request.remote_addr}"))
                return render_template('change_password.html', form=form)

            # Validating that new pass is different
            if new_password == current_password:
                flash('New password must be different from the current password')
                return render_template('change_password.html', form=form)

            
            update_user = User(username=username, password=new_password, role="user", bio="dummy")
            
            # Using the new hash and inserting it to the db
            resetQuery = text("UPDATE user SET password = :new_pass WHERE username = :username")
            db.session.execute(
                resetQuery, {"new_pass": update_user.password, "username": username})
            db.session.commit()

            flash('Password changed successfully')
            return redirect(url_for('main.dashboard'))
        else:
            
            return render_template('change_password.html', form=form)

    return render_template('change_password.html', form=password_form())

@main.route('/logout', methods = ['GET'])
def logout():
    """the logout method clears the session object, and makes the user lose the ability to acsess the funcitonality of the webiste

    Returns:
         returns the user to the main login
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
        query = text("SELECT * FROM doctors")
        doctors = db.session.execute(query).mappings()
        return jsonify([doctors])
    
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
    executeQuery = text(f"SELECT * FROM doctors WHERE {query}")
    doctors = db.session.execute(executeQuery, filters).mappings()
    return jsonify(dict(doctors))

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
    form = request_form()

    if form.validate_on_submit():
        
        new_request = Request(
            user_id = current_user.id,
            age = form.age.data,
            symptoms = form.symptoms.data,
            symptoms_details = form.symptoms_details.data,
            family_issues = form.family_issues.data,
            family_details = form.family_details.data
        )

        try:
            db.session.add(new_request)
            db.session.commit()

        except Exception as e:
            db.session.rollback()
            logger.error(sanitisationForLogs(f"Error submitting medical request for user {session.get('user')}: {str(e)}"))
            flash('An error occurred while submitting your request. Please try again.')
            return render_template('new_request.html', form=form)

    return render_template('new_request.html', form=form)

@main.route('/view-requests')
def view_requests():
    if not current_user.is_doctor:
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to view requests by user {session.get('user')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to view this page."), 403

    if not medical_request or medical_request.status != 'pending':
        flash('Request not found or already processed.')
        return redirect(url_for('main.view_requests'))
        
    medical_request.doctor_id = current_user.id
    
    try:

        chat = Chat(
            patient_id=medical_request.user_id,
            doctor_id=current_user.id,
            request_id=medical_request.id       
        )

        db.session.add(chat)
        db.session.commit()

        flash('Request accepted successfully.')
        return redirect(url_for('main.chat', chat_id=chat.id))
    
    except Exception as e:
        db.session.rollback()
        logger.error(sanitisationForLogs(f"Error accepting request {request_id} for user {session.get('user')}: {str(e)}"))
        flash('An error occurred while accepting the request. Please try again.')

    return redirect(url_for('main.view_requests'))

@main.route('/reject-request/<int:request_id>', methods=['POST'])
def reject_request(request_id):
    if not current_user.is_doctor:
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to reject request {request_id} by user {session.get('user')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to perform this action."), 403
    
    try:
        medical_request = Request.query.get(request_id)
        if not medical_request or medical_request.status != 'pending':
            flash('Request not found or already processed.')
            return redirect(url_for('main.view_requests'))
        medical_request.status = 'rejected'
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
    chat = Chat.query.get(chat_id)
    if not chat or (current_user.id not in [chat.patient_id, chat.doctor_id]):
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to chat {chat_id} by user {session.get('user')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You do not have access to this chat."), 403   
    if request.method == 'POST':
        content = request.form.get('content')
        if content:
            new_message = Message(chat_id=chat_id, sender_id=current_user.id, receiver_id=chat.doctor_id if current_user.id == chat.patient_id else chat.patient_id, content=content)
            try:
                db.session.add(new_message)
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                logger.error(sanitisationForLogs(f"Error sending message in chat {chat_id} for user {session.get('user')}: {str(e)}"))
                flash('An error occurred while sending your message. Please try again.')
    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp).all()
    return render_template('chat.html', chat=chat, messages=messages)   
  
@main.route('/delete_account', methods = ['GET', 'POST'])    
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
            row = db.session.execute(query, {"username" : username}).mappings().first()

            if not row:
                session.clear()
                return render_template('delete_account.html', form=form)

            user = db.session.get(User, row['id'])

            # Validating that the current pass is correct
            if not user or not user.check_hash(current_password):
                flash('Current password is incorrect')
                logging.warning(sanitisationForLogs(f"Incorrect current password provided for {username} from {request.remote_addr}"))
                return render_template('delete_account.html', form=form)           

            db.session.delete(user) #delete user from database
            db.session.commit() 

            flash('Account Deleted Successfully!')
            return redirect(url_for('main.login'))
        else:
            session.clear()
            return render_template('delete_account.html', form=form)
    
    
    
        
    