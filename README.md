# 🚆 Real Rail — Railway Booking System v2.0

A modern, full-stack railway ticket reservation and management web application built with **Node.js, Express, React, Vite, Tailwind CSS, Prisma ORM, and PostgreSQL**.

---

## 🚀 Live Deployment & URLs

* **Frontend (Vercel):** https://railway-booking-2-0-sigma.vercel.app
* **Backend API (Render):** 

---

## 🛡️ Admin Access Credentials

To log in and test the **Admin Dashboard** (managing trains, stations, schedules, and pricing):
* **Admin Email:** `admin@test.com` *(or create an admin account directly in your database/register)*
* **Password:** `password123`

---

## ✨ Features & Architecture

### 👤 User Features
* **User Authentication:** Secure registration and login using JSON Web Tokens (JWT) and bcrypt password hashing.
* **Train Search & Discovery:** Search for available trains between source and destination stations with date filters.
* **Seat Selection & Booking:** Interactive booking flow with real-time seat allocation and PNR generation.
* **Booking Management:** View active and past bookings, download/view ticket confirmations, and check PNR status.
* **Live Train Status & Station Board:** Real-time tracking interface and station schedule boards.

### 👑 Admin Features
* **Admin Control Panel:** Dedicated restricted route (`/admin`) protected by `AdminRoute` middleware.
* **Train & Station Management:** Add, update, and manage train schedules, routes, and station master data.
* **Dynamic Pricing Engine:** Configure ticket pricing tiers and class structures.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, React Router, Tailwind CSS, Framer Motion
* **Backend:** Node.js, Express.js, Prisma ORM
* **Database:** PostgreSQL (Hosted via Neon / Render database)
* **Deployment:** Vercel (Frontend) & Render (Backend API)

---

## ⚙️ Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/suraj-86/railway-booking-2.0.git
   cd railway-booking-2.0
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Configure your .env with DATABASE_URL and JWT_SECRET
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Configure your .env with VITE_API_URL=http://localhost:5000
   npm run dev
   ```
