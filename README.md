UOM Course Finder – Full Stack Application

A modern mobile application built to help students browse, enroll, and manage university courses.
The system includes a React Native frontend, .NET backend, MongoDB database, JWT authentication, and global dark mode support.

✨ Features
Frontend (React Native + TypeScript)

🔐 Authentication

Login, Register

Forgot password (OTP-based reset)

Reset password

JWT token stored securely

🌓 Global Dark Mode (using custom ThemeProvider)

Toggle stored in AsyncStorage

Automatically applied across all screens

🎨 Modern UI

Profile screen with editable user details

Home screen with course search & filtering

Course details, favorites, and enrolled course tracking

❤️ Favorites System

Redux store for managing favorite courses

Persistent UI updates

📚 Course Browsing

Search, filter by category

Detailed view with rating & duration

🧭 Navigation

Bottom tab navigation

Stack navigation for details & auth screens

🛠 Backend (.NET 9 + MongoDB)
Key Features

JWT Authentication (Login / Register)

Refreshable user profile

Update profile (fullName, username, dark mode preference)

OTP system for:

Email verification

Password reset

Course Management:

Get all courses

Get course by ID

Enrollment API:

Enroll in a course

Get enrolled courses per user

Backend Technology Stack

.NET 9 Web API

C#

MongoDB

BCrypt password hashing

JWT Token Authentication

Swagger documentation

📱 Frontend Technology Stack

React Native (Expo)

TypeScript

Redux Toolkit

React Navigation

Axios (API communication)

AsyncStorage (token & theme preference)

Formik + Yup (form validation)

Custom Theme System (light/dark mode)

📂 Project Structure
Backend
Backend/
  Controllers/
  Models/
  Services/
  Settings/
  Program.cs
  appsettings.json

Frontend
Frontend/
  screens/
  components/
  services/
  redux/
  navigation/
  theme/
  utils/
  App.tsx

🔑 API Endpoints Overview
Auth
POST /Auth/register
POST /Auth/login
POST /Auth/forgot-password
POST /Auth/reset-password

Profile
GET /Profile
PUT /Profile

Courses
GET /Courses
GET /Courses/{id}

Enrollment
POST /Enroll
GET /Enroll/my-courses

🚀 Getting Started
Backend Setup

Navigate to backend folder:

cd Backend


Restore packages:

dotnet restore


Run the API:

dotnet run

Frontend Setup

Navigate to frontend:

cd Frontend


Install dependencies:

npm install


Start the app:

npx expo start