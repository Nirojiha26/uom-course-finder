<h1 align="center"> 🎓 UOM Course Finder Mobile App  
</h1>

A modern cross-platform mobile application built using **React Native (Expo)** and **ASP.NET Core (.NET 9)**.  
The app helps university students browse, enroll, and manage courses with secure authentication, profile management, and global dark mode support.

---

## Features

### 🔹 Course Management
- Browse all available courses
- Search and filter courses by category
- View detailed course information
- Enroll in courses
- View enrolled courses per user

### 🔹 Authentication & Security
- User registration & login
- JWT-based authentication
- OTP-based forgot password & reset password
- Secure token storage using AsyncStorage

### 🔹 Favorites System
- Add/remove courses from favorites
- Persistent favorites using Redux Toolkit
- View favorite courses in profile

### 🔹 User Profile
- View & update profile
- Upload & update profile picture
- Toggle dark mode preference

### 🔹 Smooth Navigation
- Bottom navigation bar with:
  - Home
  - Favorites
  - My Courses
  - Profile

---

## Technologies Used

### **Backend (ASP.NET Core + MongoDB)**
- .NET 9 Web API
- C#
- MongoDB
- JWT Authentication
- BCrypt password hashing
- OTP Email Service
- Static file hosting (profile image upload)
- Swagger Documentation

### 🔹 **Frontend (React Native + Expo)**
- React Native
- Expo
- TypeScript
- Redux Toolkit
- Axios
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage
- expo-image-picker
- Custom Theme System (Light/Dark)

---

## Project Structure

### 🔹 Backend

```text
Backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── CoursesController.cs
│   ├── EnrollController.cs
│   └── ProfileController.cs
├── Models/
│   ├── AuthDtos.cs
│   ├── Course.cs
│   ├── EnrolledCourse.cs
│   ├── UpdateProfileDto.cs
│   └── User.cs
├── Services/
│   ├── CourseService.cs
│   ├── EmailService.cs
│   ├── EnrollService.cs
│   ├── JwtService.cs
│   └── UserService.cs
├── Settings/
│   ├── JwtSettings.cs
│   └── MongoDbSettings.cs
├── wwwroot/
│   └── profile-images/
├── appsettings.json
├── appsettings.Development.json
├── Backend.csproj
├── Backend.http
└── Program.cs


Frontend/
├── assets/
│   ├── Screenshots
│   └── images
├── components/
│   ├── Banner.tsx
│   ├── CategoryTabs.tsx
│   ├── CourseCard.tsx
│   ├── Header.tsx
│   └── SearchBar.tsx
├── navigation/
│   ├── BottomTabs.tsx
│   └── RootNavigator.tsx
├── redux/
│   ├── slices/
│   └── store.ts
├── screens/
│   ├── CourseDetailsScreen.tsx
│   ├── EditProfileScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── MyCoursesScreen.tsx
│   ├── OtpVerifyScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ResetPasswordScreen.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── courses.ts
│   └── enroll.ts
├── theme/
│   └── ThemeProvider.tsx
├── utils/
│   └── Storage.ts
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json


##  Screenshots

<table>
  <tr>
    <td><img src="frontend/assets/Screenshots/Screenshot1.png" height="420" /></td>
    <td><img src="frontend/assets/Screenshots/Screenshot2.png" height="420" /></td>
    <td><img src="frontend/assets/Screenshots/Screenshot3.png" height="420" /></td>
  </tr>
  <tr>
    <td><img src="frontend/assets/Screenshots/Screenshot4.png" height="420" /></td>
    <td><img src="frontend/assets/Screenshots/Screenshot5.png" height="420" /></td>
    <td><img src="frontend/assets/Screenshots/Screenshot6.png" height="420" /></td>
  </tr>
  <tr>
    <td><img src="frontend/assets/Screenshots/Screenshot7.png" height="420" /></td>
    <td><img src="frontend/assets/Screenshots/Screenshot8.png" height="420" /></td>
    <td><img src="frontend/assets/Screenshots/Screenshot9.png" height="420" /></td>
  </tr>
</table>