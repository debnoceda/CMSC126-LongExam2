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
cd backend

```bash
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





