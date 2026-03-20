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
from flask_login import login_required, current_user


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
            session.permanent =True
            
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
            #clearing old data
            session.clear()

            if not user.check_hash(password):
                flash('Login credentials are invalid, please try again')
                logging.warning(sanitisationForLogs(f"Incorrect credentials, incorrect login with the data username: {session['user']} , {session['password']} from the address: {request.remote_addr} "))
                return render_template('login.html', forms=forms)
            #setting up the session perssistance.
        
            
            session['user'] = user.username
            session['role'] = user.role
            session['bio'] = user.bio            
            logger.info(sanitisationForLogs(f"user logged in with the name: {user.username} from {request.remote_addr}"))
            return redirect(url_for('main.dashboard'))
    
        else:
            logger.error(sanitisationForLogs(f"incorrect submission from attempt from the address {request.remote_addr} with the name {session['user']}"))
            return render_template('login.html', forms = forms)

    return render_template('login.html', forms = forms, error=error)

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
            role = "user"
            
            logging.info(sanitisationForLogs(f"forms validated during registration for the user: {username} from the ip {request.remote_addr} "))

            

            check_query = text("SELECT username FROM user WHERE username = :username")
            result = db.session.execute(check_query, {"username": username})
            row = result.first()

            
            session.clear()
            if row:
                flash('There already is a user registered with that username... \n Please register with a different username.')
                logging.info(sanitisationForLogs(f"user tried to create an account with the username {username} from the ip {request.remote_addr} "))
                return render_template("register.html", forms = forms)

            safe_bio = bleach.clean(bio, 
                                 tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                                 attributes={'a' : ['href', 'title']},
                                 strip = True)
            dbUser = User(username, password, role, safe_bio)
            
            

            query = text("INSERT INTO user (username, password, role, bio) VALUES (:username, :password, :role, :bio)")
            #storing encrypted credentials
            db.session.execute(query, {"username" : dbUser.username, "password" : dbUser.password, "role" : "user", "bio" : dbUser.bio})
            db.session.commit()
            

            session['user'] = username
            session['role'] = role
            session['bio'] = bio     
            

            logging.info(sanitisationForLogs(f"user has been registered with the name {username} from the ip {request.remote_addr}"))
            return redirect(url_for('main.login'))
        else:
            render_template('register.html', forms = forms)
    return render_template('register.html', forms = forms)

@main.route('/admin-panel')
def admin():
    if session.get('role') != 'admin':
       #the 403 code is made so that flask does not assume its its 200 OK status;
        logging.warning(sanitisationForLogs(f"user tried to acsess the admin panel from the ip {request.remote_addr}"))
        return render_template("forbidden.html", message = "you need to be an logged in as a admin to view this page"), 403 
    return render_template('admin.html')

@main.route('/moderator')
def moderator():
    #still revise http headers;
    if session.get('role') != 'moderator':
        logging.warning(sanitisationForLogs(f"user tried to acsess the moderator panel from the ip {request.remote_addr}")) 
        return render_template("forbidden.html", message = "you need to be logged in as a moderator to view this page"), 403
    return render_template('moderator.html')

@main.route('/user-dashboard')
def user_dashboard():
    try:
        if session.get('role') != 'user':
            logger.warning(sanitisationForLogs(f"Forbidden access attempt: role={session.get('role')}"))
            return render_template("forbidden.html", message= "you need to be logged in to view this page"), 403 
        return render_template('user_dashboard.html', username=session.get('user'))
    except InvalidToken:
        return redirect(url_for('main.login'))


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
    session.clear()
    return redirect(url_for('main.login'))

@main.route('/new-request', methods=['GET', 'POST'])
@login_required
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
@login_required
def view_requests():
    if not current_user.is_doctor:
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to view requests by user {session.get('user')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to view this page."), 403
    
    try:
        requests = Request.query.filter_by(doctor_id=None).all()
        return render_template('view_requests.html', requests=requests)
    except Exception as e:
        logger.error(sanitisationForLogs(f"Error retrieving medical requests for user {session.get('user')}: {str(e)}"))
        flash('An error occurred while retrieving requests. Please try again.')
        return render_template('view_requests.html', requests=[])

@main.route('/accept-request/<int:request_id>', methods=['POST'])
@login_required
def accept_request(request_id):
    if not current_user.is_doctor:
        logger.warning(sanitisationForLogs(f"Unauthorized access attempt to accept request {request_id} by user {session.get('user')} from {request.remote_addr}"))
        return render_template("forbidden.html", message="You need to be logged in as a doctor to perform this action."), 403
    
    try:
        medical_request = Request.query.get(request_id)

        if not medical_request or medical_request.status != 'pending':
            flash('Request not found or already processed.')
            return redirect(url_for('main.view_requests'))
        
        medical_request.doctor_id = current_user.id

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
@login_required
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
@login_required
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