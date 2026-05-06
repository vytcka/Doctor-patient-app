FROM python:3.12

WORKDIR /app

COPY flaskServer/requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "-m", "flaskServer.run"]