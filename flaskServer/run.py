import os
import time
import pytest

env = os.getenv('FLASK_ENV', 'development')

if __name__ == '__main__':
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        base_dir = os.path.dirname(os.path.abspath(__file__))
        tests_dir = os.path.join(base_dir, 'flaskServer', 'tests')
        if not os.path.exists(tests_dir):
            tests_dir = os.path.join(base_dir, 'tests')
            
        result = pytest.main([tests_dir, '-v', '--tb=short'])

    import sqlalchemy as sa
    db_url = os.getenv('DATABASE_URL')
    for i in range(2):
        try:
            engine = sa.create_engine(db_url)
            conn = engine.connect()
            conn.close()
            break
        except Exception:
            time.sleep(2)

    from flaskServer import create_app
    app = create_app()

    if env == 'development':
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        app.run(host='0.0.0.0', port=5000, debug=False)