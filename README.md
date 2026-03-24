# DevFolio Pro

A premium, highly interactive full-stack portfolio application featuring a modern Glassmorphism UI, built with the React ecosystem and Convex for real-time data sync.

## Project Structure
The project is organized into two main folders:
- `/frontend` - React + Vite + Tailwind CSS + Framer Motion
- `/backend` - Node.js + Express (for custom auth) and Convex (Real-time Database schemas & functions)

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Router v6
- **Backend**: Node.js, Express, jsonwebtoken, bcrypt
- **Database**: Convex (Real-time, Serverless DB)

## Local Development Setup

### 1. Backend & Convex Setup
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```
Start the Convex database locally (this will prompt you to log into Convex and create a project):
```bash
npx convex dev
```
Start the Express server (in a separate terminal inside `backend`):
```bash
node server.js
```

### 2. Frontend Setup
Open another terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder and add your Convex URL (you'll get this after running `npx convex dev`):
```env
VITE_CONVEX_URL="https://your-convex-url.convex.cloud"
```
Start the Vite development server:
```bash
npm run dev
```

## Features
- ✨ **Glassmorphism UI**: Soft shadows, glows, and backdrop blurs
- ✨ **Framer Motion Animations**: Smooth page reveals, magnetic buttons, and custom cursor
- ✨ **Real-time Engine**: Powered by Convex to sync messages, skills, and projects instantly
- ✨ **Admin Dashboard**: Protect routes and manage data securely

## Deployment

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Set the Root Directory to `frontend`.
4. Add the `VITE_CONVEX_URL` environment variable.
5. Deploy!

### Backend (Render / Railway)
1. Create a new Web Service on Render or Railway.
2. Set the Root Directory to `backend` (or configure the start command to `cd backend && node server.js`).
3. Add environment variables: `PORT=5000`, `JWT_SECRET=...`, `ADMIN_PASSWORD=...`.
4. Deploy!

### Database (Convex)
Convex automatically syncs your local schema to the cloud when you run `npx convex deploy` from the `backend` folder.

Enjoy your new premium portfolio!
