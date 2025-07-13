# Frogetta - Personal Finance Management App

A modern web application for managing personal finances, built with **Django REST Framework** (backend) and **React Vite** (frontend).

<img alt="Menu" src="https://github.com/debnoceda/CMSC126-LongExam2/blob/main/frontend/public/Frogetta-Cover.png">

## ✨ Features

- **User Authentication**
  - Secure registration and login
  - Email validation
  - Password strength requirements
  - JWT-based authentication

- **Wallet Management**
  - Create and manage multiple wallets
  - Track wallet balances
  - Custom wallet colors
  - Default "Cash" wallet on registration

- **Transaction Tracking**
  - Record income and expenses
  - Categorize transactions
  - Add notes to transactions
  - View transaction history

- **Budgeting**
  - Set monthly budget
  - Track spending against budget
  - Visual budget progress

- **Analytics**
  - Income vs Expenses visualization
  - Monthly spending trends
  - Category-wise expense breakdown
  - Interactive charts and graphs

- **Profile Management**
  - Update personal information
  - Change password
  - Upload profile picture
  - Set monthly budget

## 📦 Requirements

### Backend
- Python 3.x
- Django
- Django REST Framework
- Pillow (for image handling)
- django-cors-headers
- djangorestframework-simplejwt

### Frontend
- React.js
- npm

### Frontend Dependencies
```bash
# Core Dependencies
npm install react react-dom react-router-dom
npm install axios jwt-decode

# UI Components
npm install @iconify/react
npm install react-chartjs-2 chart.js
```

## 🛠 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CMSC126-LongExam2.git
cd CMSC126-LongExam2
```

### 2. Setup Backend
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run Django server
python manage.py runserver
```

### 3. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Running the Application

### Backend
The Django server runs at `http://localhost:8000`
```bash
cd backend
python manage.py runserver
```

### Frontend
The React app runs at `http://localhost:5173`
```bash
cd frontend
npm run dev
```

## 📝 User Guide

### Registration
1. Click "Sign Up" on the landing page
2. Fill in your details:
   - First Name
   - Last Name
   - Email (must be unique)
   - Password (must contain uppercase, number, and minimum 8 characters)
3. Click "Register"
4. You'll be automatically logged in and redirected to the setup page

### Login
1. Click "Log In" on the landing page
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your dashboard

### Managing Wallets
1. Navigate to "Wallets" from the sidebar
2. Click "+" to add a new wallet
3. Enter wallet name and choose a color
4. View your wallet balance and transactions

### Adding Transactions
1. Click the "+" button in the header
2. Select transaction type (Income/Expense)
3. Fill in the details:
   - Title
   - Amount
   - Date
   - Wallet
   - Category
   - Notes (optional)
4. Click "Add Transaction"

### Viewing Analytics
1. Navigate to "Analytics" from the sidebar
2. View your:
   - Monthly income vs expenses
   - Spending trends
   - Category-wise breakdown
3. Use the dropdowns to filter by year and month

### Managing Profile
1. Click your profile picture in the header
2. Select "Profile"
3. Update your:
   - Personal information
   - Password
   - Profile picture
   - Monthly budget
4. Click "Save Changes"

## 🔒 Security Features
- JWT-based authentication
- Password hashing
- Email validation
- Protected routes
- CSRF protection
- CORS configuration

## 🐛 Troubleshooting

### Common Issues
1. **Backend not starting**
   - Ensure virtual environment is activated
   - Check if port 8000 is available
   - Verify all dependencies are installed

2. **Frontend not starting**
   - Check React.js version
   - Ensure all npm packages are installed
   - Verify port 5173 is available

3. **Database issues**
   - Run `python manage.py migrate`
   - Check database settings in settings.py

### Getting Help
- Check the console for error messages
- Verify API endpoints are accessible
- Ensure both frontend and backend are running
