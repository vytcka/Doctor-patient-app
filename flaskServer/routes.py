import traceback
from flask import request, render_template, redirect, url_for, session, Blueprint, flash, abort
from sqlalchemy import text
from . import db
from .models import User, Decypher
from .forms import validation_form, registration_form, password_form
import bleach
from cryptography.fernet import InvalidToken
from . import sanitisationForLogs
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
    forms = validation_form();
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
        #now we decrypt it vai the class;
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
    
    
@main.route('/api/session', methods=['GET'])
def api_session():
    if 'user' not in session:
        return jsonify({'authenticated': False}), 200
    return jsonify({'authenticated': True, 'username': session['user'], 'role': session['role']}), 200


@main.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    form = validation_form(data=data, meta={'csrf': False})

    if not form.validate():
        return jsonify({'errors': form.errors}), 400

    query = text("SELECT * FROM user WHERE username = :username")
    row = db.session.execute(query, {"username": form.username.data}).mappings().first()

    if row is None:
        return jsonify({'error': 'No user with that name exists'}), 401

    user = db.session.get(User, row['id'])

    if not user.check_hash(form.password.data):
        return jsonify({'error': 'Invalid credentials'}), 401

    session.clear()
    session.permanent = True
    session['user'] = user.username
    session['role'] = user.role
    session['bio'] = user.bio

    logger.info(sanitisationForLogs(f"API login: {user.username} from {request.remote_addr}"))
    return jsonify({'username': user.username, 'role': user.role}), 200


@main.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    form = registration_form(data=data, meta={'csrf': False})

    if not form.validate():
        return jsonify({'errors': form.errors}), 400

    check = text("SELECT username FROM user WHERE username = :username")
    row = db.session.execute(check, {"username": form.username.data}).first()

    if row:
        return jsonify({'error': 'Username already taken'}), 409

    safe_bio = bleach.clean(form.bio.data,
                            tags=['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'ol', 'li', 'br'],
                            attributes={'a': ['href', 'title']},
                            strip=True)

    new_user = User(form.username.data, form.password.data, "user", safe_bio)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Registered successfully'}), 201


@main.route('/api/dashboard', methods=['GET'])
def api_dashboard():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorised'}), 401
    try:
        bio = Decypher(session['bio']).get_text()
        return jsonify({'username': session['user'], 'role': session['role'], 'bio': bio}), 200
    except InvalidToken:
        return jsonify({'error': 'Session invalid'}), 401


@main.route('/api/change-password', methods=['POST'])
def api_change_password():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorised'}), 401

    data = request.get_json()
    form = password_form(data=data, meta={'csrf': False})

    if not form.validate():
        return jsonify({'errors': form.errors}), 400

    query = text("SELECT * FROM user WHERE username = :username LIMIT 1")
    row = db.session.execute(query, {"username": session['user']}).mappings().first()
    user = db.session.get(User, row['id'])

    if not user.check_hash(form.current_password.data):
        return jsonify({'error': 'Current password is incorrect'}), 400

    if form.new_password.data == form.current_password.data:
        return jsonify({'error': 'New password must differ from current'}), 400

    updated = User(username=session['user'], password=form.new_password.data, role="user", bio="dummy")
    reset = text("UPDATE user SET password = :new_pass WHERE username = :username")
    db.session.execute(reset, {"new_pass": updated.password, "username": session['user']})
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200


@main.route('/api/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200

    


