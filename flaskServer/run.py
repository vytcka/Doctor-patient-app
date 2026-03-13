from flaskServer import create_app
import os

#can be set to production if needed in the env file
env = os.getenv('FLASK_ENV')
print("hello world")


app = create_app()

if __name__ == '__main__':
    if(env == 'development'):
        app.run(debug=True)
    else:
       app.run(debug=False)