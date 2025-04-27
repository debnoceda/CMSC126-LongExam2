# CMSC126-LongExam2

A web application built with **Django REST Framework** (backend) and **React Vite** (frontend).

---

## 📦 Requirements

**Backend:**
- Python 3.x
- Django
- Django REST Framework

**Frontend:**
- Node.js (v18+ recommended)
- npm

Additional React libraries used:
- `axios`
- `react-router-dom`
- `jwt-decode`

---

## 🛠 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CMSC126-LongExam2.git
cd CMSC126-LongExam2
```

### 2. Setup Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
# or
python3 -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate
# or
python3 manage.py migrate

# Run Django server
python manage.py runserver
# or
python3 manage.py runserver
```

### 3. Setup Frontend

```bash
cd frontend

#Install dependencies
npm install axios react-router-dom jwt-decode
```

## 🚀 Running the Application

### Running the Backend
Open a terminal in the backend directory:
```bash
# Make sure your virtual environment is activated
venv\Scripts\activate

# Change directory to backend
cd backend

# Start the Django server
python manage.py runserver
```
The backend will be available at `http://localhost:8000`

### Running the Frontend
Open another terminal in the frontend directory:

```bash
# Change directory to backend
cd backend

# Start the Vite development server
npm run dev
```
The frontend will be available at `http://localhost:5173`

## 📝 Usage
1. Open `http://localhost:5173` in your browser
2. Register a new account or login with existing credentials
3. Start managing your budget!

---

## ⚠️ Important Notes
- Keep both backend and frontend servers running while using the application
- The backend must be running for the frontend to work properly