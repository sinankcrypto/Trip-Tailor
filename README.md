Hello World 🌍

A full-stack travel booking platform built with Django + React, where users can discover, personalize, and book travel experiences offered by verified agencies.

🚀 Key Features
👤 Authentication & Roles

User, Agency, and Admin authentication

JWT-based authentication (access & refresh tokens)

Secure cookie-based refresh token flow

Role-based access control

Email-based verification and booking notifications

🧠 Smart Recommendations

Personalized package recommendations for logged-in users

Weighted recommendation logic based on:

User-selected interests

User interactions (views & bookings)

Package popularity

Automatic fallback to popular packages when insufficient data exists

Guests see latest packages, while authenticated users see recommended packages

Interest reminder UX to encourage personalization

🧳 Travel & Booking

Browse and search travel packages

Filter by price, agency, and keywords

Book packages with date validation

Prevent duplicate or conflicting bookings

Booking status lifecycle:

Pending

Confirmed

Completed

Cancelled

Email notifications for booking-related actions (user & agency)

💬 Real-Time Communication

Real-time chat between users and agencies using WebSockets

Message persistence with full chat history

Separate conversations per booking

Optimistic UI updates for smooth user experience

💳 Payments

Stripe payment gateway integration

Secure checkout sessions

Platform fee deduction

Agency earnings tracking

Transaction history for agencies

📊 Dashboards
Admin Dashboard

Total users, agencies, bookings, and earnings

Weekly & monthly analytics

Agency Dashboard

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

Celery (background tasks & emails)

Frontend

React (Vite)

Tailwind CSS

Axios

Recharts (analytics & charts)

WebSocket client for real-time features

Toast-based UI feedback for user actions

Payments

Stripe

🧱 Architecture & Practices

Repository pattern for ORM queries

Clean separation of concerns:

Views

Serializers

Services

Repositories

Token-based authentication

Scalable real-time architecture using WebSockets

Pagination, filtering, ordering, and search support

Dockerized development environment

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

Smart recommendation system implemented

Real-time chat functional

Stripe payments integrated

Dashboards live

Email notifications for booking actions

Actively expanding with advanced personalization & notification features

🔮 Planned Enhancements

Real-time in-app notifications

Advanced recommendation tuning

Performance optimizations

Additional analytics & insights
