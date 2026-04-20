# 🚀 DevFolio Pro — Modern Full-Stack Portfolio

A **premium, highly interactive full-stack portfolio application** built with a modern **Glassmorphism UI**, smooth animations, and **real-time data sync using Convex**.

---
## 🌐 Live Demo

👉 modern-dev-portfolio-ihz1-ii0vuqqum-sai766932-4764s-projects.vercel.app

## ✨ Features

* 🎨 **Glassmorphism UI**
  Soft shadows, blur effects, and modern visual aesthetics

* ⚡ **Framer Motion Animations**
  Smooth transitions, page reveals, magnetic buttons, custom cursor

* 🔄 **Real-time Data Sync**
  Powered by Convex for instant updates (projects, skills, messages)

* 🔐 **Secure Admin Dashboard**
  Protected routes with authentication (JWT + bcrypt)

---

## 🏗️ Project Structure

```
root/
│
├── frontend/   → React + Vite + Tailwind + Framer Motion
├── backend/    → Node.js + Express + Convex
```

---

## 🧰 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* React Router v6

### Backend

* Node.js
* Express.js
* jsonwebtoken (JWT)
* bcrypt

### Database

* Convex (Real-time Serverless DB)

---

## ⚙️ Local Development Setup

### 1️⃣ Backend & Database Setup

```bash
cd backend
npm install
```

#### Start Convex (Real-time DB)

```bash
npx convex dev
```

> ⚠️ This will prompt you to log in and create a Convex project

#### Start Express Server

```bash
node server.js
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

#### Create `.env` file

```env
VITE_CONVEX_URL="https://your-convex-url.convex.cloud"
```

#### Run Frontend

```bash
npm run dev
```

---

## 🌐 Deployment Guide

### 🚀 Frontend (Vercel)

1. Push project to GitHub
2. Import into Vercel
3. Set **Root Directory → `frontend`**
4. Add environment variable:

   ```
   VITE_CONVEX_URL=your_url
   ```
5. Deploy

---

### ⚙️ Backend (Render / Railway)

1. Create a new Web Service
2. Set root directory → `backend`
   OR use start command:

   ```bash
   cd backend && node server.js
   ```
3. Add environment variables:

   ```
   PORT=5000
   JWT_SECRET=your_secret
   ADMIN_PASSWORD=your_password
   ```
4. Deploy

---

### ☁️ Database (Convex)

Deploy schema to cloud:

```bash
npx convex deploy
```

---

## 🔐 Environment Variables

### Frontend

```
VITE_CONVEX_URL=
```

### Backend

```
PORT=
JWT_SECRET=
ADMIN_PASSWORD=
```

---

## 🎯 Key Highlights

* Full-stack portfolio with **real-time updates**
* Clean architecture (frontend + backend separation)
* Production-ready authentication system
* Smooth UI/UX with modern design trends

---

## 📸 Future Improvements

* 🌙 Dark/Light theme toggle
* 📊 Analytics dashboard
* 📧 Email integration for contact form
* 🧠 AI-based portfolio suggestions

---

## 🙌 Conclusion

DevFolio Pro is a **complete modern portfolio solution** combining:

* Design ✨
* Performance ⚡
* Real-time capabilities 🔄

Perfect for showcasing projects in a **premium and professional way**.

---

⭐ If you like this project, consider giving it a star!
