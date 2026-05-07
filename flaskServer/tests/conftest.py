import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
import pytest
from flaskServer import create_app, db

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client