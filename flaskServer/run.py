import os
import time
import pytest

env = os.getenv('FLASK_ENV', 'development')
db_url = os.getenv('DATABASE_URL')
print(f"Connecting to: {db_url}")

def run_tests():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    tests_dir = os.path.join(base_dir, 'flaskServer', 'tests')
    if not os.path.exists(tests_dir):
        tests_dir = os.path.join(base_dir, 'tests')
    print(f"Running tests from {tests_dir}")
    result = pytest.main([tests_dir, '-v', '--tb=short'])
    if result != 0:
        print("Tests failed — starting anyway.")
    else:
        print("All tests passed!")

if __name__ == '__main__':
    from flaskServer import create_app
    app = create_app()

    run_tests()

    if env == 'development':
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        app.run(host='0.0.0.0', port=5000, debug=False)