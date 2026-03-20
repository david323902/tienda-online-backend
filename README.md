# 🛒 Backend — Tienda Online (E-Commerce API)

> Robust REST API for a full e-commerce platform built with Node.js, Express.js and PostgreSQL. Includes PayPal payment integration, JWT authentication, and MVC architecture.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![PayPal](https://img.shields.io/badge/PayPal-00457C?style=flat&logo=paypal&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat)

🌐 **Live API:** [https://tienda-online-backend-xu3j.onrender.com](https://tienda-online-backend-xu3j.onrender.com)  
🖥️ **Live Frontend:** [https://frontend-zlkp.onrender.com](https://frontend-zlkp.onrender.com)  
🌍 **Production site:** [www.interconectadosweb.es](https://www.interconectadosweb.es)

---

## 📌 Overview

Production-ready REST API backend for a full e-commerce platform. Designed with a clean **MVC architecture**, prioritizing security, scalability, and data consistency across the entire purchase flow. The frontend is served separately — see [tienda-online-frontend](https://github.com/david323902/tienda-online-frontend).

---

## ⚙️ Features

### 🔐 Authentication & Security
- JWT-based user authentication and authorization
- Bcrypt password hashing
- Helmet HTTP security headers
- Express Rate Limiter — brute-force protection
- CORS configuration for frontend communication

### 🛍️ E-Commerce Core
- Full product management — CRUD with image uploads (Multer)
- Shopping cart management
- Order creation and lifecycle management
- PayPal SDK integration for online payments
- Transaction consistency and error handling

### 👥 User Management
- User registration and login
- Role-based route protection
- Email notifications via Nodemailer (order confirmations)

### 📊 Monitoring & Logging
- HTTP request logging with Morgan
- Critical event logging with Winston

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server and REST API |
| PostgreSQL + Sequelize | Relational database and ORM |
| JWT + Bcrypt | Authentication and password security |
| PayPal SDK | Payment processing |
| Multer | Product image uploads |
| Nodemailer | Email notifications |
| Helmet + Rate Limiter | Security hardening |
| Morgan + Winston | Logging |
| Docker | Containerization |
| GitHub Actions | CI/CD pipeline |
| Render | Cloud deployment |

---

## 🏗️ Architecture (MVC)

```
backend-de-tienda-online/
├── routes/          # REST endpoint definitions
├── controllers/     # Business logic
├── models/          # Sequelize data models and DB relations
├── middlewares/     # Auth, validation, security
├── services/        # PayPal, email integrations
├── config/          # DB and environment config
└── server.js        # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js 18+
PostgreSQL
Docker (optional)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/david323902/backend-de-tienda-online.git
cd backend-de-tienda-online

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your DB credentials, JWT secret, PayPal keys, etc.

# Run database migrations
npx sequelize db:migrate

# Start development server
npm run dev
```

### Run with Docker

```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

```env
PORT=3000
DB_HOST=localhost
DB_NAME=tienda_online
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 🔗 Related Repository

- **Frontend:** [tienda-online-frontend](https://github.com/david323902/tienda-online-frontend) — React + Vite SPA that consumes this API

---

## 👤 Author

**Johan David Toro Ortiz** — full backend development, MVC architecture, DB modeling, security implementation, PayPal integration  
📧 davidortiz634@gmail.com · [LinkedIn](https://www.linkedin.com/in/TU-URL-AQUI) · [GitHub](https://github.com/david323902)

---

## 🇪🇸 Descripción en español

API REST completa para una plataforma de comercio electrónico, desplegada en Render y accesible en producción en [interconectadosweb.es](https://www.interconectadosweb.es). Incluye autenticación con JWT, integración de pagos con PayPal SDK, gestión de productos con subida de imágenes, carrito de compras, pedidos y notificaciones por correo. Arquitectura MVC con Node.js, Express.js y PostgreSQL. Frontend separado en React + Vite.
