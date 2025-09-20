Team Name - Rendering

Team Members - Archit Varma, Swara Jadhav, Kushagra Saxena 

PS 1
CommunityFund – Micro-Donation &
Impact Tracking Platform for Local Causes

Problem Statement - People want to support local community projects (e.g., a school garden, a neighborhood

clean-up, helping a family in crisis) but lack a trusted, transparent platform for micro-
donations. They are unsure how their small contribution makes a tangible impact.

Tech Stack Used - 

🧩 Tech stack

Frontend

React (SPA for dashboards, project pages, moderator UI)

Tailwind CSS (utility-first styling)

Recharts or Chart.js (charts & infographics)

Axios (HTTP client)

Backend

Node.js + Express (API server)

Mongoose (MongoDB ODM)

Database

MongoDB (MongoDB Atlas recommended for production)

Payments

Razorpay (or mock/test gateway during development)

Auth & Security

JWT (JSON Web Tokens for auth)

bcrypt (password hashing)

Role-based access: donor | creator | moderator | admin

Setup Instructions -

# DonateUs — Micro-Donation & Impact Tracking Platform

**DonateUs** is a hyper-local micro-donation platform where donors build a “donation portfolio” (like an investment portfolio). Moderators verify local projects and donors see real-world impact (e.g., kids helped, trees planted). Ideal for small recurring donations, transparent impact tracking, and community-driven projects.

---

## Badges
*(Replace with real badges/links for CI, license, deploy when available)*  
`[![Build](https://img.shields.io/badge/build-passing-brightgreen)] [![License: MIT](https://img.shields.io/badge/license-MIT-blue)]`

---

## Table of contents
- [Features](#features)  
- [Tech stack](#tech-stack)  
- [Architecture](#architecture)  
- [Quick start (local)](#quick-start-local)  
- [Environment variables](#environment-variables)  
- [API endpoints (examples)](#api-endpoints-examples)  
- [Sample response: /api/user/portfolio](#sample-response-apiuserportfolio)  
- [Docker (optional)](#docker-optional)  
- [Deployment tips](#deployment-tips)  
- [Troubleshooting](#troubleshooting)  
- [Contributing](#contributing)  
- [License & contact](#license--contact)

---

## Features
- Project submission & moderator verification (pending → approved / rejected)  
- Role-based access: `donor`, `creator`, `moderator`, `admin`  
- Micro-donations (supports tiny amounts like ₹1/₹5) — Razorpay integration (test & live)  
- User donation portfolio: allocation pie chart + impact bar chart (kids helped, trees planted, families assisted)  
- Simple moderator dashboard to review & categorize projects

---

## Tech stack
**Frontend**
- React (SPA)  
- Tailwind CSS  
- Recharts or Chart.js for charts  
- Axios for API requests

**Backend**
- Node.js + Express  
- Mongoose (MongoDB ODM)

**Database**
- MongoDB (MongoDB Atlas recommended)

**Payments**
- Razorpay (test keys during development)

**Auth & Security**
- JWT for authentication  
- bcrypt for password hashing

**Optional / infra**
- AWS S3 / Cloudinary (media storage)  
- Vercel / Netlify (frontend hosting)  
- Render / Heroku / AWS (backend hosting)  
- GitHub Actions (CI/CD), Sentry (error monitoring)

---

## Architecture
