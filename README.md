# TreatMe

An application that connects healthcare professionals with patients seeking non-urgent medical advice.

## Description

TreatMe is a digital healthcare platform designed to connect patients with qualified healthcare professionals for non-urgent medical advice.
Patients begin by signing up and then completing a health questionnaire covering their symptoms and relevant medical history. Based on this input, the system matches them with a suitable heathcare professional. This ensures that advice is relevant and personalised. 
Our application also enables doctors to sign up and provide medical guidance to patients seeking assistance. Doctors are required to submit relevant qualifications during registration to ensure patients receive legitimate healthcare advice.

## Key Features

- **Secure Messaging System**
  
  Patients and doctors can communicate through a private, secure messaging channel.
- **Verified NHS Professionals**
  
  All doctors on the platform are qualified NHS doctors, ensuring users are receiving trusted and reliable medical advice.
- **Five-Star Rating System**
  
  Patients can rate their experience after each consultation. Ratings are displayed on doctor profiles to promote user transparency.
- **Doctor Filtering**
  
  Users can filter healthcare professionals based on criteria such as rating, gender, and language, to increase the chance of a positive match.
- **Role-Based Authentication**

  Users can sign up and log in as either a patient or a doctor, with access to features specific to their role.
- **Free-to-Use Service**
  
  The platform is designed to be accessible to all users without cost, improving healthcare accessibility.

## Rationale

The purpose of our application is to improve healthare accessbility and reduce pressure on traditional healthcare services. 
Our application is an easier solution for patients in rural areas and we provide faster access to medical advice for non-urgent issues. TreatMe aims to work alongside GPs to help reduce waiting times for patients. 

## Visuals

### Homepage
! [Homepage Screenshot](./docs/homepage.jpeg)

### Login Page
! [Login Page Screenshot](./docs/login.jpeg)

### Request Form
! [Request Form Screenshot](./docs/requestform.jpeg)

### Doctor Profile Page
! [Doctor Profile Page Screenshot](./docs/doctorprofile.jpeg)

## Installation

### Requirements
Before running the project, ensure you have installed:
- Node.js (https://nodejs.org/)
- Python 3.10+
- pip (Python package manager)

### Clone the repository
```bash
git clone https://github.com/vytcka/Doctor-patient-app.git
```

### Navigate to the project directory
```bash
cd Doctor-patient-app
```

## Usage

Start the backend:
```bash
cd flaskServer
pip install -r requirements.txt
python -m flaskServer.run
```

Start the frontend:
```bash
cd client
npm install
npm start
```

Open:
```bash
http://localhost:3000
```

## Mapping Criteria to Your Codebase

This table shows where each criteria is implemented in the TreatMe project.

| **Criteria** | **Where to Find It (File Paths, Links, or Explanations)** |
|--------------|-----------------------------------------------------------|
| **Team Standards: Cohesion** | Code is structured into clear modules: `client` (frontend React app), `flaskServer` (backend API), and `docs/` (screenshots). |
| **Team Standards: Documentation** | Main documentation is in `README.md` and `teamLetter.md`. Inline comments are used throughout. |
| **Team Standards: Version Control Workflow** | GitHub repository: https://github.com/vytcka/Doctor-patient-app. Commit history shows feature-based commits. |
| **Design & Structure** | Frontend structure in `client'. Backend structured in `flaskServer` using Flask routes. |
| **GUI: Clever and Interesting Design** | React UI located in `client`. Includes login, signup, doctor search, and request forms. Screenshots found in 'docs'. |
| **Testing Documentation** | Basic testing is handled manually. API endpoints tested via frontend interaction and browser console. |
| **Functionality and Features** | Full system implemented in `client` and `flaskServer`: user authentication, doctor-patient matching, messaging system, rating system, and health request submission. |

## Authors and acknowledgment

- Boshra Chaanoune
- Farrell Choubeun Kepngang
- Sophie Jennings
- Benjamin Middlecote
- Fruitfulness Omoragbon
- Vytautas Pakalka
- Kunmira Yantavej

## License

[MIT]
(https://choosealicense.com/licenses/mit/)
