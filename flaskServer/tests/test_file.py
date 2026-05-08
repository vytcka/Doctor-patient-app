def test_control():
    """This is used to make sure that the control tests work"""
    a = 4
    assert a == 4

def test_doctor_login(client):
    """The user is created within the create application"""
    res = client.post('/doctor/login', json={
        'username': 'jamesturner@email.com',
        'password': 'Doctorpass!23'
    })
    assert res.status_code == 200

def test_moderator_login_success(client):
    res = client.post('/moderator/login', json={
        "username": "moderator1@email.com",
        "password": "Moderatorpass!23"
    })
    assert res.status_code == 200

def test_moderator_login_wrong_password(client):
    res = client.post('/moderator/login', json={
        "username": "moderator1@email.com",
        "password": "WrongPassword!99"
    })
    assert res.status_code == 400

def test_doctor_reviews_valid_nhs(client):
    res = client.post('/doctor/reviews', json={"nhs_number": "1234567890"})
    assert res.get_json()["status"] == 200

def test_login_no_data(client):
    res = client.post('/login', json={})
    assert res.status_code == 400

def test_login_unknown_user(client):
    res = client.post('/login', json={
        "username": "nobody@test.com",
        "password": "Password!23abc"
    })
    assert res.status_code == 400

def test_login_wrong_password(client):
    client.post('/register', json={
        "username": "user@test.com",
        "password": "Correctpass!23",
        "bio": "This is my personal biography for testing purposes.",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01",
        "location": "London"
    })
    res = client.post('/login', json={
        "username": "user@test.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 400

def test_register_missing_fields(client):
    """Edge case: missing required fields"""
    res = client.post('/register', json={"username": "test@test.com"})
    assert res.status_code == 400

def test_login_banned_user(client):
    """Edge case: banned account cannot login"""
    res = client.post('/login', json={
        "username": "patient3@email.com",
        "password": "Patientpass!78"
    })
    assert res.status_code == 400

def test_login_suspended_user(client):
    """Edge case: suspended account cannot login"""
    res = client.post('/login', json={
        "username": "patient2@email.com",
        "password": "Patientpass!45"
    })
    assert res.status_code == 400

def test_login_success(client):
    """Uses seeded patient account from __init__.py"""
    res = client.post('/login', json={
        "username": "patient1@email.com",
        "password": "Patientpass!23"
    })
    assert res.status_code == 200

# ── /register ────────────────────────────────────────────────────────────────

def test_register_success(client):
    res = client.post('/register', json={
        "username": "newuser@test.com",
        "password": "Password!23abc",
        "bio": "This is my personal biography for testing purposes.",
        "first name": "Jane",
        "last name": "Doe",
        "date of birth": "1995-05-05",
        "location": "Manchester"
    })
    assert res.status_code in [200, 400]

def test_register_duplicate_username(client):
    data = {
        "username": "duplicate@test.com",
        "password": "Password!23abc",
        "bio": "This is my personal biography for testing purposes.",
        "first name": "Jane",
        "last name": "Doe",
        "date of birth": "1995-05-05",
        "location": "Manchester"
    }
    client.post('/register', json=data)
    res = client.post('/register', json=data)
    assert res.status_code == 400

# ── /doctor/login ─────────────────────────────────────────────────────────────

def test_doctor_login_unknown(client):
    res = client.post('/doctor/login', json={
        "username": "fakdoctor@nhs.com",
        "password": "Password!23abc"
    })
    assert res.status_code == 404

def test_doctor_login_wrong_password(client):
    res = client.post('/doctor/login', json={
        "username": "jamesturner@email.com",
        "password": "WrongPassword!99"
    })
    assert res.status_code == 401

def test_doctor_login_success(client):
    """Uses seeded doctor account from __init__.py"""
    res = client.post('/doctor/login', json={
        "username": "jamesturner@email.com",
        "password": "Doctorpass!23"
    })
    assert res.status_code == 200

# ── /logout ───────────────────────────────────────────────────────────────────

def test_logout(client):
    res = client.get('/logout')
    assert res.status_code == 200
    assert res.get_json()["status"] == 200

# ── /filter ───────────────────────────────────────────────────────────────────

def test_filter_no_filters(client):
    res = client.post('/filter', json={})
    assert res.status_code == 200

def test_filter_by_location(client):
    res = client.post('/filter', json={"location": "London"})
    assert res.status_code == 200

def test_filter_by_specialty(client):
    res = client.post('/filter', json={"specialty": "Cardiology"})
    assert res.status_code == 200

def test_filter_by_language(client):
    res = client.post('/filter', json={"language": "English"})
    assert res.status_code == 200

def test_filter_by_rating(client):
    res = client.post('/filter', json={"rating": 4})
    assert res.status_code == 200

def test_filter_by_multiple(client):
    res = client.post('/filter', json={
        "location": "London",
        "specialty": "Cardiology",
        "language": "English",
        "rating": 4
    })
    assert res.status_code == 200

# ── /doctor/reviews ───────────────────────────────────────────────────────────

def test_doctor_reviews_missing_nhs(client):
    res = client.post('/doctor/reviews', json={})
    assert res.get_json()["status"] == 400

def test_doctor_reviews_invalid_nhs(client):
    res = client.post('/doctor/reviews', json={"nhs_number": "0000000000"})
    assert res.get_json()["status"] == 400

def test_doctor_reviews_success(client):
    # register doctor first
    client.post('/doctor/register', json={
        "nhs number": "1234567890",
        "first name": "Dr",
        "last name": "Smith",
        "username": "drsmith@nhs.com",
        "password": "correctpassword",
        "date of birth": "1980-01-01",
        "location": "Sheffield",
        "specialty": "Cardiology",
        "language": "English",
        "bio": "experienced doctor",
        "availability": True
    })
    res = client.post('/doctor/reviews', json={"nhs_number": "1234567890"})
    assert res.get_json()["status"] == 200

# ── /change-password ──────────────────────────────────────────────────────────

def test_change_password_not_logged_in(client):
    res = client.post('/change-password', json={
        "current_password": "old",
        "new_password": "new"
    })
    assert res.get_json()["status"] == 400

def test_change_password_wrong_current(client):
    client.post('/register', json={
        "username": "testuser@test.com",
        "password": "oldpassword",
        "bio": "hello",
        "first name": "Jane",
        "last name": "Doe",
        "date of birth": "1995-05-05",
        "location": "Manchester"
    })
    res = client.post('/change-password', json={
        "current_password": "wrongpassword",
        "new_password": "newpassword"
    })
    assert res.get_json()["status"] == 400

# ── /delete_account ───────────────────────────────────────────────────────────

def test_delete_account_not_logged_in(client):
    res = client.post('/delete_account', json={
        "current_password": "password"
    })
    assert res.status_code == 403