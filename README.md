# 🍔 Feasto – Full Stack MERN Food Delivery Platform

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success?logo=mongodb)
![Razorpay](https://img.shields.io/badge/Payment-Razorpay-02042B?logo=razorpay)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue?logo=cloudinary)
![License](https://img.shields.io/badge/License-Portfolio-orange)

---

## 📖 Overview

Feasto is a modern **Full Stack MERN Food Delivery Platform** inspired by applications like **Zomato** and **Swiggy**.

The platform allows customers to browse food items, manage their cart, place secure online orders using **Razorpay**, and track order status in real time.

It also includes a dedicated **Admin Dashboard** for managing food items, customer orders, and restaurant operations.

---

## 🌐 Live Demo

### 🍽️ Customer Application

https://feasto-frontend-qt0n.onrender.com

### 🛠️ Admin Dashboard

https://feasto-admin-567d.onrender.com

### ⚙️ Backend API

https://feasto-backend-pcbq.onrender.com

---
# ✨ Features

## 👤 User Features

- 🚪 **Mandatory Authentication Gate (`WelcomeGate`)**: Clear entry screen requiring user Sign In, Sign Up, or Admin access before browsing (no unauthorized guest browsing).
- 🔐 **Strict Session Isolation & Secure Data Wipe**: Instant, complete eradication of tokens, cached carts, profile data, and orders on logout—preventing cross-user leakage.
- 🗺️ **Interactive Live Delivery Tracking Map**: Real-time order tracking powered by **Leaflet** & **OpenStreetMap** with animated driver coordinates and store pinpoints.
- 🤖 **Smart AI Assistant (Google Gemini 3.0)**: Context-aware recommendations and order help using `gemini-3.8-flash` with Indian Rupee (`₹`) pricing and formatted markdown responses.
- 🍽️ **Dynamic Menu & Craving Filters**: Appetizing hero banner with one-click category filters (*Fresh & Crisp*, *Savory & Hearty*, *Sweet Treats*).
- 🔍 **Real-Time Menu Search**: Instant fuzzy filtering by dish name and food category.
- 🛒 **Persistent Shopping Cart**: Synchronized cart items with backend validation.
- 💳 **Online Payment Gateway (Razorpay)**: Secure checkout with HMAC signature verification and order confirmation.
- 📦 **Order History & Tracking**: Real-time status updates (*Food Processing*, *Out for Delivery*, *Delivered*).
- 👤 **Refined User Profile**: Clean, distraction-free card design with profile photo upload, account management, and instant logout.
- 🔔 **Toast Notifications**: Interactive feedback using React Toastify.
- 📱 **Fully Responsive Design**: Optimized across mobile, tablet, and desktop screens.

---

## 🛠️ Admin Features

- 🔑 **Role-Based Admin Authentication**: Dedicated admin login protecting sensitive restaurant operations.
- 🍕 **Food & Menu Management**: Add, update, and remove food items with Cloudinary image upload and INR pricing.
- ☁️ **Cloudinary Image Integration**: Automated media upload and cloud hosting for dish thumbnails.
- 📦 **Live Customer Orders Management**: Track all incoming customer orders with status updates (*Food Processing*, *Out for Delivery*, *Delivered*).
- 🗺️ **Live Driver Tracking Coordinates**: Store and update live delivery coordinates for customer map tracking.
- 🌐 **Dynamic Portal Navigation**: Instant links between the Admin dashboard and customer website (dynamically resolving for `localhost` and production).

---
# 🛠 Tech Stack

## 🎨 Frontend

- **React 18** & **Vite**
- **React Router DOM**
- **Leaflet** & **React-Leaflet** (Interactive OpenStreetMap delivery tracking)
- **Axios**
- **Lucide React** (Icons)
- **React Toastify**
- **CSS3** (Responsive design, animations)

---

## ⚙️ Backend

- **Node.js** & **Express.js**
- **MongoDB Atlas** & **Mongoose**
- **JWT (JSON Web Tokens)** (Role-scoped authentication)
- **Google Gemini 3.0 API** (`gemini-3.8-flash`)
- **Razorpay Payment Gateway**
- **Cloudinary** & **Multer** (Media uploads)

---

## ☁️ Deployment

| Service | Platform |
|----------|----------|
| Frontend | Render |
| Admin Dashboard | Render |
| Backend API | Render |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |

---

## 🧰 Development Tools

- Visual Studio Code
- Git & GitHub
- Postman
- MongoDB Compass
- Render
- npm

---
# 📁 Project Structure

```text
Feasto
│
├── frontend/          # Customer-facing React application
├── backend/           # Express.js REST API
├── admin/             # Admin dashboard
├── .env               # Local shared environment configuration (not committed)
├── README.md
└── .gitignore
```

---

# ⚙️ Local Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/AyushKumar-12345/Feasto.git
cd Feasto
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

### Admin Dashboard

```bash
cd ../admin
npm install
```

---

## 3️⃣ Configure Environment Variables

Configure the single repository-root `.env` file with the provider credentials
and URLs listed below. Vite frontends and the backend load this shared file.
Keep it private: never commit `.env` or expose backend secrets through `VITE_*`
variables.

For Render or another host, set variables in each service's environment
settings:

| Service | Variables |
| --- | --- |
| Customer frontend | `VITE_BACKEND_URL`, `VITE_ADMIN_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_FORMSPREE_FORM_ID` |
| Admin frontend | `VITE_BACKEND_URL`, `VITE_FRONTEND_URL` |
| Backend | `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, `ADMIN_URL`, `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL` |

The customer and admin `VITE_BACKEND_URL` values must point to the same backend
base URL (for example, `https://your-api.onrender.com`, without `/api`). Set
`FRONTEND_URL` and `ADMIN_URL` to the full public origins of your customer and
admin apps, including `https://` and without a trailing slash.

For Formspree, create a form at [Formspree](https://formspree.com/) and copy
the form ID from its endpoint (`https://formspree.io/f/{form_id}`) into
`VITE_FORMSPREE_FORM_ID`. The contact page discloses that Formspree processes
submissions. The public Formspree ID is not a secret.

`VITE_*` values are visible to every browser user. Never put backend secrets in
them.

## 4️⃣ Configure AI Assistant

Feasto uses Google Gemini 3.0 models to provide intelligent, contextual dish recommendations and order support. Configure your Gemini API key in the backend environment (do not expose the key in frontend variables):

```env
# Google Gemini 3.0 (Get free key at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
```

The assistant sends chat messages and menu details to Google Gemini. When a customer
is signed in, up to five of their recent paid order summaries may be included
(status, items, and date only; no address or phone). Chat history is not stored
by Feasto.

---

## 5️⃣ Configure the shared API URL

The customer and admin applications should use the same backend service.
Set `VITE_BACKEND_URL` to that API's base URL in both frontend deployment
environments. Both default to the published Feasto backend when the variable
is not set.

Failed sign-ins are rate-limited in each backend process. For a multi-instance
deployment, also configure an edge or shared rate limiter so the limit is
consistent across instances.

## 6️⃣ Authentication and authorization

Customer and administrator sessions use separate signed JWT audiences and
roles. The backend derives the customer identity from the verified token,
checks that the customer account still exists, and restricts administrator
operations to administrator tokens. Order creation recalculates prices from
the server menu, and order history, payment verification, and delivery tracking
are scoped to the authenticated customer.

Deploy the backend and both frontend apps from the same project revision so
their token format and protected routes stay in sync. After deploying the
scoped-token change, customers and admins must sign in again.

## 7️⃣ Run the Project Locally (Native Node.js)

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cluster

### Start Backend API (Port 4000)
```bash
cd backend
npm install
npm run server
```

### Start Customer Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### Start Admin Dashboard (Port 5174)
```bash
cd admin
npm install
npm run dev
```

---

## 8️⃣ Run with Docker & Docker Compose

Feasto includes production-grade containerization with multi-stage Dockerfiles and a `compose.yaml` file for full-stack local development.

### Option A: Run the Complete Stack with Docker Compose
The Docker Compose configuration automatically spins up:
- **`mongodb`**: Isolated local database with persistent named volume (`feasto_mongodb_data`).
- **`backend`**: Node 20 Alpine container with health check on port `4000`.
- **`frontend`**: Production-built Vite bundle served via high-performance Nginx on port `5173`.
- **`admin`**: Production-built admin bundle served via Nginx on port `5174`.

```bash
# 1. Prepare environment variables
cp .env.example .env

# 2. Build and start all services in detached mode
docker compose up --build -d

# 3. View container health and logs
docker compose ps
docker compose logs -f backend

# 4. Stop and tear down containers
docker compose down
```

> **Note on MongoDB**: If `MONGODB_URI` is left unconfigured in `.env`, Compose automatically connects to the internal `mongodb` container (`mongodb://mongodb:27017/feasto`). If you provide a MongoDB Atlas URI in `.env`, the backend connects directly to your Atlas cluster.

### Option B: Build and Run Individual Docker Containers

#### Backend Container
```bash
# Build image
docker build -t feasto-backend:latest -f backend/Dockerfile ./backend

# Run container (injecting environment variables from .env)
docker run -d --name feasto-backend -p 4000:4000 --env-file .env feasto-backend:latest

# Check container health
docker inspect --format='{{json .State.Health.Status}}' feasto-backend
```

#### Customer Frontend Container
```bash
docker build -t feasto-frontend:latest -f frontend/Dockerfile ./frontend
docker run -d --name feasto-frontend -p 5173:80 feasto-frontend:latest
```

#### Admin Dashboard Container
```bash
docker build -t feasto-admin:latest -f admin/Dockerfile ./admin
docker run -d --name feasto-admin -p 5174:80 feasto-admin:latest
```

---

## 9️⃣ Automated Testing & Quality Checks

Run all automated test suites and linting checks locally matching the CI pipeline:

```bash
# Backend unit & integration tests (18 tests via Node test runner)
cd backend && npm test

# Frontend linting and production build check
cd ../frontend && npm run lint && npm run build

# Admin linting and production build check
cd ../admin && npm run lint && npm run build
```

---

## 🔟 Continuous Integration & Deployment (GitHub Actions)

The repository includes an automated CI/CD pipeline at `.github/workflows/ci-cd.yml` triggered on every push and pull request to `main`:

1. **Lint, Test & Build**:
   - Executes across Ubuntu Latest on Node.js 20 with npm caching.
   - Runs all 18 backend tests (auth, assistant, cart, health, CORS).
   - Validates ESLint flat-config linting across customer and admin codebases.
   - Executes Vite production builds for both frontends.
2. **Container Verification**:
   - Configures Docker Buildx.
   - Builds backend, frontend, and admin production Docker images to verify container compatibility.
   - Uses GitHub Actions cache (`type=gha`) for fast, reproducible image builds.

### Deployment Next Steps
Feasto is configured for Render deployment via [`render.yaml`](./render.yaml). When pushing to `main`, Render automatically syncs static builds for the customer frontend and admin dashboard, and re-deploys the web service for the backend.

---

## 🛠️ Troubleshooting

### 1. MongoDB Atlas SRV Connection Timeouts
- **Symptom**: `MongooseError: querySrv ENODATA` or connection timeout.
- **Solution**: Feasto's `backend/config/loadEnv.js` automatically sets Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) DNS servers for SRV resolution. If your local network or firewall blocks custom DNS, use the local MongoDB service via Docker Compose (`mongodb://mongodb:27017/feasto`) or specify a direct standard connection string.

### 2. Missing Cloudinary / Razorpay Configuration
- **Symptom**: `Missing Cloudinary environment variables.` on backend startup.
- **Solution**: Ensure `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_SECRET_KEY` are defined in `.env`. For local testing without image uploads, place dummy non-empty strings in `.env`.

### 3. Port Already in Use (EADDRINUSE)
- **Symptom**: `Error: listen EADDRINUSE: address already in use :::4000`.
- **Solution**: A previous Node or Docker process is holding port 4000. Stop it via `docker compose down` or terminate the running Node process (`Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force` on Windows).

---
# 📸 Application Preview

## 🏠 Home Page

> _Screenshot Coming Soon_

---

## 🍽️ Food Menu

> _Screenshot Coming Soon_

---

## 🔍 Search & Categories

> _Screenshot Coming Soon_

---

## 🛒 Shopping Cart

> _Screenshot Coming Soon_

---

## 💳 Razorpay Checkout

> _Screenshot Coming Soon_

---

## 📦 My Orders

> _Screenshot Coming Soon_

---

## 👤 User Profile

> _Screenshot Coming Soon_

---

## 🛠️ Admin Dashboard

> _Screenshot Coming Soon_

---

## 🍕 Food Management

> _Screenshot Coming Soon_

---

## 📋 Order Management

> _Screenshot Coming Soon_

---
# 🚀 Future Improvements

- ❤️ Wishlist & Favorites Functionality
- 🎟️ Promotional Coupons & Promo Codes
- 📧 Automated Order Confirmation Emails
- 🔔 Real-time Web Push Notifications
- 🏠 Multiple Saved Delivery Addresses
- ⭐ Verified Dish Ratings & Reviews
- 🌙 Dark Mode / Theme Toggle
- 📱 Progressive Web App (PWA) Offline Support
- 🌍 Multi-language & Localization Support

---

# 🤝 Contributing

Contributions, issues, and feature requests are welcome!

If you'd like to contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is created for **learning, educational, and portfolio purposes**.

---

# 👨‍💻 Developer

## Ayush Kumar

**B.Tech Information Technology**  
**IIIT Bhubaneswar**

📧 **Email**  
ayushkumardandapat200@gmail.com

💼 **LinkedIn**  
https://www.linkedin.com/in/ayush-kumar-97326636a/

💻 **GitHub**  
https://github.com/AyushKumar-12345

🌐 **Portfolio**  
https://ayush-portfolio-3yan.onrender.com

---

# ⭐ Support

If you found this project helpful, please consider giving it a **⭐ Star** on GitHub.

It helps increase the visibility of the project and supports my work.

---

<div align="center">

### 🍔 Built with ❤️ using the MERN Stack

**Thank you for visiting this repository!**

</div>