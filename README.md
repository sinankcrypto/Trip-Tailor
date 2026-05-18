# Trip Tailor 🌍

A full-stack travel booking platform built with **Django + React**, where users can discover, customize, and book trips offered by verified travel agencies.

---

## 🚀 Features

### 👤 Authentication & Roles

* User, Agency, and Admin authentication
* JWT-based authentication (access & refresh tokens)
* Secure cookie-based refresh token flow
* Role-based access control

### 🧳 Travel & Booking

* Browse, search, and filter travel packages
* Booking validation (date validation & conflict prevention)
* Booking lifecycle management:

  * Pending
  * Confirmed
  * Completed
  * Cancelled

### 💬 Real-Time Communication

* Real-time chat between users and agencies using WebSockets
* Persistent chat history
* Booking-based conversations
* Optimistic UI updates for smoother UX

### 💳 Payments

* Stripe payment gateway integration
* Secure checkout sessions
* Agency earnings tracking after platform fees
* Transaction history for agencies

### 📊 Dashboards

#### Admin Dashboard

* Users, agencies, bookings, and earnings overview
* Weekly & monthly analytics

#### Agency Dashboard

* Booking and earnings insights
* Daily bookings overview
* Weekly trends with charts

### 🏢 Agency Management

* Agency profile creation & verification
* Admin approval workflow (pending / approved / rejected)
* Agency-specific package management

---

## 🛠️ Tech Stack

### Backend

* Django
* Django REST Framework
* Django Channels (WebSockets)
* PostgreSQL
* JWT Authentication

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Recharts

### Payments

* Stripe

---

## 🧱 Architecture & Practices

* Repository pattern for ORM queries
* Clean separation of concerns (Views, Serializers, Repositories)
* Scalable real-time architecture with WebSockets
* Pagination, filtering, ordering, and search support

---

## 📦 Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/sinankcrypto/Trip-Tailor.git
cd Trip-Tailor
```

### 2️⃣ Backend setup

```bash
cd backend

python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3️⃣ Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Current Status

✅ Core booking flow completed
✅ Real-time chat implemented
✅ Stripe payments integrated
✅ Dashboards functional

Actively expanding with more advanced travel and personalization features.
