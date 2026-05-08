def test_control():
    """This is used to make sure taht the control tests work"""
    a = 4
    assert a == 4

def test_doctor_login(client):
    """The user is created within the create application"""
    res = client.post('/doctor/login', json={
        'username': 'jamesturner@email.com',
        'password': 'Doctorpass!23'
    })
    assert res.status_code == 200
    
def test_login_no_data(client):
    res = client.post('/login', json={})
    assert res.status_code == 400

def test_login_unknown_user(client):
    res = client.post('/login', json={
        "username": "nobody@test.com",
        "password": "password123"
    })
    assert res.status_code == 400

def test_login_wrong_password(client):
    # register first then try wrong password
    client.post('/register', json={
        "username": "user3@test.com",
        "password": "correctpassword",
        "bio": "This is a valid test biography",
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

def test_login_empty_password(client):
    res = client.post('/login', json={
        "username": "user@test.com",
        "password": "",
        "bio": "This is a valid test biography",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01",
        "location": "London"
    })
    assert res.status_code == 400

def test_login_empty_username(client):
    res = client.post('/login', json={
        "username": "",
        "password": "password123",
        "bio": "This is a valid test biography",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01",
        "location": "London"
    })
    assert res.status_code == 400

# ── /register ────────────────────────────────────────────────────────────────

def test_register_duplicate_username(client):
    data = {
        "username": "duplicate1@test.com",
        "password": "password123",
        "bio": "This is a valid test biography",
        "first name": "Jane",
        "last name": "Doe",
        "date of birth": "1995-05-05",
        "location": "Manchester"
    }
    client.post('/register', json=data)
    res = client.post('/register', json=data)
    assert res.status_code == 400
    assert res.get_json()["message"] == "Username already taken"

def test_register_missing_password(client):
    res = client.post('/register', json={
        "username": "user@test.com",
        "password": "",
        "bio": "This is a valid test biography",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01",
        "location": "London"
    })
    assert res.status_code == 400

def test_register_missing_username(client):
    res = client.post('/register', json={
        "username": "",
        "password": "password123",
        "bio": "This is a valid test biography",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01",
        "location": "London"
    })
    assert res.status_code == 400

def test_register_empty_data(client):
    res = client.post('/register', json={})
    assert res.status_code == 400

def test_register_short_bio(client):
    res = client.post('/register', json={
        "username": "user4@test.com",
        "password": "password123",
        "bio": "Short",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01",
        "location": "London"
    })
    assert res.status_code == 400

def test_register_missing_location(client):
    res = client.post('/register', json={
        "username": "user5@test.com",
        "password": "password123",
        "bio": "This is a valid test biography",
        "first name": "John",
        "last name": "Doe",
        "date of birth": "1990-01-01"
    })
    assert res.status_code == 400

# ── /doctor/login ─────────────────────────────────────────────────────────────

def test_doctor_login_unknown(client):
    res = client.post('/doctor/login', json={
        "username": "fakdoctor@nhs.com",
        "password": "password123"
    })
    assert res.status_code == 400

def test_doctor_login_wrong_password(client):
    client.post('/doctor/register', json={
        "nhs number": "1234567890",
        "first name": "Dr",
        "last name": "Smith",
        "username": "drsmit1h@nhs.com",
        "password": "correctpassword",
        "date of birth": "1980-01-01",
        "location": "Sheffield",
        "specialty": "Cardiology",
        "language": "English",
        "bio": "This is a valid test biography",
        "availability": True
    })
    res = client.post('/doctor/login', json={
        "username": "drsmit1h@nhs.com",
        "password": "wrongpassword"
    })
    assert res.status_code == 400

# ── /logout ───────────────────────────────────────────────────────────────────

def test_logout(client):
    res = client.get('/logout')
    assert res.status_code == 200
    assert res.get_json()["status"] == 200

def test_logout_not_logged_in(client):
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

def test_filter_by_rating(client):
    res = client.post('/filter', json={"rating": 4})
    assert res.status_code == 200

def test_filter_by_language(client):
    res = client.post('/filter', json={"language": "English"})
    assert res.status_code == 200

def test_filter_by_availability(client):
    res = client.post('/filter', json={"availability": True})
    assert res.status_code == 200

def test_filter_by_multiple_criteria(client):
    res = client.post('/filter', json={
        "location": "Sheffield",
        "specialty": "Cardiology",
        "rating": 4,
        "language": "English",
        "availability": True
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
    res = client.post('/doctor/reviews', json={
        "nhs_number": "1234567890",
        "reviews": [
            {
                "rating": 5,
                "comment": "Great doctor!"
            }
        ]
    })
    assert res.get_json()["status"] == 200

# ── /change-password ──────────────────────────────────────────────────────────

def test_change_password_not_logged_in(client):
    res = client.post('/change-password', json={
        "current_password": "old",
        "new_password": "new"
    })
    assert res.get_json()["status"] == 400

# ── /delete_account ───────────────────────────────────────────────────────────

def test_delete_account_not_logged_in(client):
    res = client.post('/delete_account', json={
        "current_password": "password"
    })
    assert res.status_code == 403