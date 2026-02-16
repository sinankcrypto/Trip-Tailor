Trip Tailor 🌍

A full-stack travel booking platform built with Django + React, where users can discover, customize, and book trips offered by verified travel agencies.

🚀 Features
👤 Authentication & Roles

User, Agency, and Admin authentication

JWT authentication with access & refresh tokens

Secure cookie-based refresh token flow

Role-based access control

🧳 Travel & Booking

Browse and search travel packages

Filter by price, agency, and keywords

Book packages with date validation

Prevent duplicate/conflicting bookings

Booking status lifecycle (pending, confirmed, completed, cancelled)

💬 Real-Time Communication

Real-time chat between users and agencies using WebSockets

Message persistence with chat history

Separate chat access per booking / conversation

Optimistic UI updates for smoother UX

💳 Payments

Stripe payment gateway integration

Secure checkout sessions

Agency earnings tracking after platform fee

Transaction history for agencies

📊 Dashboards

Admin dashboard

Total users, agencies, bookings, earnings

Monthly & weekly analytics

Agency dashboard

Total bookings

Total earnings (after platform fee)

Today’s bookings

Weekly booking trends with charts

🏢 Agency Management

Agency profile creation & verification flow

Admin approval system (pending / approved / rejected)

Agency-specific package management

Separate agency portal

🛠️ Tech Stack
Backend

Django

Django REST Framework

Django Channels (WebSockets)

PostgreSQL

JWT Authentication

Frontend

React (Vite)

Tailwind CSS

Recharts (analytics & charts)

Axios

WebSocket client for real-time features

Payments

Stripe

🧱 Architecture & Practices

Repository pattern for ORM queries

Clean separation of concerns (views, serializers, repositories)

Token-based authentication

Scalable real-time architecture using WebSockets

Pagination, filtering, ordering, and search support

📦 Setup
1️⃣ Clone the repository
git clone https://github.com/sinankcrypto/Trip-Tailor.git
cd Trip-Tailor

2️⃣ Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt


Set environment variables and run:

python manage.py migrate
python manage.py runserver

3️⃣ Frontend setup
cd frontend
npm install
npm run dev

🌱 Current Status

Core booking flow completed

Real-time chat implemented

Stripe payments live

Dashboards functional

Actively expanding with industry-relevant features
