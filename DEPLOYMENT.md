# Envocti | Production Deployment Guide

This guide details the step-by-step instructions to deploy the Envocti E-Waste Management System.

---

## 💻 1. Database Setup (MongoDB Atlas)
Since local MongoDB instances cannot be accessed by cloud servers, you must set up a cloud-hosted MongoDB cluster:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and build a database using the **M0 (Free)** shared cluster tier.
3. Choose a provider and region closest to your target audience.
4. Set up database access:
   - Create a database user (e.g. `db_user` and note down the password).
   - Set IP Access List to allow access from **anywhere (`0.0.0.0/0`)** (necessary for dynamic hosting providers like Render).
5. Go to Database ➔ Connect ➔ Drivers, and copy your connection string (MongoDB URI). It will look like this:
   `mongodb+srv://db_user:<password>@cluster0.xxxx.mongodb.net/ewaste_management?retryWrites=true&w=majority`

---

## 🖥️ 2. Backend Deployment (Render or Railway)
Deploy the Express API server (under the `server` folder) to a service like Render:
1. Push the entire codebase to a private/public **GitHub** repository.
2. Sign up on [Render](https://render.com/) and connect your GitHub account.
3. Click **New +** ➔ **Web Service**.
4. Select your repository.
5. Configure the Web Service:
   * **Name**: `envocti-backend`
   * **Root Directory**: `server` (Important: points Render only to the backend directory)
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * **Instance Type**: `Free`
6. Add the following **Environment Variables** under the "Environment" tab:
   * `NODE_ENV`: `production`
   * `PORT`: `10000` (Render defaults to this)
   * `MONGO_URI`: `your_mongodb_atlas_connection_string_copied_above`
   * `JWT_SECRET`: `a_strong_random_jwt_secret_key`
   * `JWT_EXPIRE`: `7d`
   * `CLIENT_URL`: `your_vercel_frontend_url` (e.g. `https://your-app.vercel.app`) (Update this once your Vercel deployment completes)
   * `ADMIN_SECRET_KEY`: `your_custom_admin_registration_passphrase`
7. Click **Deploy Web Service** and wait for the build to complete. Render will provide a public URL (e.g. `https://envocti-backend.onrender.com`).

---

## 🎨 3. Frontend Deployment (Vercel)
Deploy the React client (under the `client` folder) to Vercel:
1. Sign up on [Vercel](https://vercel.com/) and connect your GitHub account.
2. Click **Add New** ➔ **Project**.
3. Import your repository.
4. Configure the Vercel project:
   * **Framework Preset**: `Vite` (Vercel auto-detects this)
   * **Root Directory**: `client` (Important: points Vercel only to the frontend directory)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Add the following **Environment Variable** under the environment variables dropdown:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://your-backend-url.onrender.com/api` (the URL of your Render backend API service, appended with `/api`)
6. Click **Deploy**. Vercel will build and provide a live URL (e.g. `https://your-app.vercel.app`).
7. **Important**: Go back to your Render dashboard and update the `CLIENT_URL` environment variable to match this Vercel URL.
