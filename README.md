# Envocti | E-Waste Collection Management System

Envocti is a production-ready MERN Stack (MongoDB, Express.js, React.js, Node.js) web application designed to streamline and gamify electronic waste recycling. 

Users can schedule pickups, trace their recycling cycle, earn Green Rewards points, and climb the leaderboard, while collectors and administrators get custom workspaces to coordinate and audit operations.

---

## 🚀 How to Run the Project

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v16.0 or higher)
- **MongoDB** (Running locally on port `27017` or configured via a connection string)

### Step 1: Install Dependencies
Run the installation script in the root directory to automatically resolve all root, server, and client package dependencies:
```bash
npm run install:all
```

### Step 2: Seed the Database (Highly Recommended)
We have provided a database seeder script to populate your MongoDB with sample users, collectors, an admin, pickup requests at various workflow stages, notifications, and reward points history.
```bash
npm run seed
```

This will output the login credentials for all roles:
* **Admin Workspace**: `admin@ewaste.com` / `admin123`
* **Collector Workspace**: `collector1@ewaste.com` / `collector123`
* **Citizen Workspace**: `user1@ewaste.com` / `user1234`

### Step 3: Run the Development Servers
Start both the Express backend server (on port `5000`) and the Vite React frontend client (on port `5173`) concurrently:
```bash
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 📂 Core Folder Structure

```
Project E-Waste Management/
├── client/                      # Vite + React Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── common/          # ProtectedRoute gates
│   │   │   └── layout/          # Navbar, Sidebar, DashboardLayout
│   │   ├── context/             # AuthContext (React session context)
│   │   ├── pages/               # Page components
│   │   │   ├── user/            # Citizen Dashboard (Overview, Booking, Stepper Tracking, Rewards)
│   │   │   ├── collector/       # Collector Dashboard (Accept, Weight Logs, Status progression)
│   │   │   └── admin/           # Admin Dashboard (Charts panels, User Management, Reports Auditor)
│   │   ├── services/            # Axios HTTP client with JWT interceptor config
│   │   ├── index.css            # Tailwind CSS v4 directives + custom glassmorphism styles
│   │   └── App.jsx              # Routing configurations
│   └── package.json
│
├── server/                      # Express Backend
│   ├── config/                  # Database connections
│   ├── controllers/             # REST controllers (Auth, Pickups, Users, Collectors, Admin)
│   ├── middleware/              # Auth session guards, RBAC rules, Multer image upload limits
│   ├── models/                  # Mongoose MongoDB schemas
│   ├── routes/                  # Express routes configuration
│   ├── utils/                   # Constants, helper utilities, database seeders
│   └── package.json
│
├── .env                         # Active environment variables config
├── package.json                 # Root commands configuration
└── README.md
```

---

## 🛠️ Main Tech Stack Details

- **Frontend**: React 18, Vite 8, React Router v7, Axios, Recharts (Analytics charts), Lucide React (Eco-theme icons), Tailwind CSS v4 (Glassmorphism panels, harmonious green colors)
- **Backend**: Node.js, Express.js, JWT (Stateless session handling), Bcryptjs (Secure password hashing), Multer (Multipart/form-data e-waste image uploads)
- **Database**: MongoDB & Mongoose (Strict indexes, status histories tracking)

---

## 🌿 E-Waste Status Workflow Flow
E-Waste collection schedules run through a strict status progression:
`Pending` ➔ `Assigned` ➔ `In Progress` ➔ `Collected` ➔ `Recycled` ➔ `Completed`

* **Citizens** schedule pickups, view timelines, and earn base Green Points on `Completed` state.
* **Collectors** accept assignments, write comments/notes, log actual weight data, and move statuses.
* **Admins** manage roles, assign pickups to specific collectors, generate audit tables, and print reports.
