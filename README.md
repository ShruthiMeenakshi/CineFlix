# 🎬 CineFlix – Full Stack Movie Web App

CineFlix is a **full-stack movie discovery web application** inspired by Netflix, where users can explore, search, and interact with movies and TV shows with a modern UI and smooth UX.

🌐 **Live Demo:** https://cine-flix-topaz.vercel.app

---

## 🚀 Features

### 🎥 Movies & Content
- 🔍 Search movies and TV shows
- 🎬 Browse trending, popular, and top-rated movies
- 📄 View detailed movie information (overview, ratings, release date)
- ▶️ Watch trailers (YouTube integration)

### 👤 User Features
- 🔐 User Authentication (Signup/Login)
- 🔑 Token-based session handling
- ❤️ Favorites / Watchlist (optional feature)

### 📬 Contact System
- 📩 Contact form with validation
- 📎 File upload support
- 🗄️ Stored in MongoDB (GridFS for attachments)

### 🎨 UI/UX
- ⚡ Smooth animations using Framer Motion
- 📱 Fully responsive design
- 🎨 Tailwind CSS modern styling

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- React Router
- Fetch API

### Backend
- Spring Boot (Java)
- REST APIs
- MongoDB Atlas
- GridFS (file storage)
- BCrypt (password encryption)

### Deployment
- Frontend → Vercel
- Backend → Render / Local
- Database → MongoDB Atlas

---

## 📂 Project Structure

cineflix/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│ └── package.json
│
├── server/ # Spring Boot backend
│ ├── controller/
│ ├── service/
│ ├── repository/
│ ├── model/
│ └── application.properties
│
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/cineflix.git
cd cineflix
```
### 2️⃣ Backend Setup (Spring Boot)
cd server

Update application.properties:

spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=MoviesHere
server.port=8082

Run backend:

mvn spring-boot:run

### 3️⃣ Frontend Setup (React)

cd client
npm install
npm run dev

### 🔐 Environment Variables

### Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/MoviesHere
Frontend
VITE_API_URL=http://localhost:8082
### 🔗 API Endpoints
### 🔐 Authentication
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
### 📬 Contact
POST /api/contact → Submit contact form
GET /api/contact → Fetch all messages
### 🎬 Movies (example)
/api/movies/search
/api/movies/popular
### 🧪 Testing
Use Postman / Thunder Client for API testing
Use Browser DevTools → Network tab for debugging frontend requests

## 🌟 Key Highlights
🔥 Full-stack application (React + Spring Boot)
⚡ Fast UI with animations
🔐 Secure authentication using BCrypt
🗄️ MongoDB + GridFS integration
📦 Clean architecture (Controller → Service → Repository)
## 🚀 Deployment
Frontend deployed on Vercel
Backend can be deployed on:
Render
Railway
## AWS / VPS
📌 Future Enhancements
🎥 Full video streaming support
💳 Payment integration
📊 Admin dashboard
🔔 Notifications system
🌙 Dark/Light mode
⚠️ Disclaimer

This project is for educational purposes only.
Movie data is fetched using third-party APIs (like TMDB).

⭐ Support

If you like this project:

⭐ Star this repo
🍴 Fork it
🧑‍💻 Contribute

---
