# 🍔 Feasto — Production-Grade MERN Food Delivery & AI Concierge Platform

[![CI/CD Pipeline](https://github.com/AyushKumar-12345/Feasto/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/AyushKumar-12345/Feasto/actions/workflows/ci-cd.yml)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%20LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%207.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Multi--Container-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-3.0%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Verified-02042B?logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render&logoColor=black)](https://feasto-frontend-qt0n.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Feasto** is an enterprise-grade, full-stack food delivery ecosystem inspired by Swiggy and Zomato. It delivers a modern customer ordering portal, an interactive Leaflet-powered live driver delivery tracking map, cryptographic Razorpay payment verification, an administrative restaurant operations dashboard, and a contextual generative AI food concierge powered by Google Gemini 3.0.

---

## 🌐 Live Production Deployments

| Component | Purpose | Live Link | Status |
| :--- | :--- | :--- | :---: |
| 🍽️ **Customer Web App** | Ordering, live cart, menu search, AI chat & order tracking | [https://feasto-frontend-qt0n.onrender.com](https://feasto-frontend-qt0n.onrender.com) | ![Live](https://img.shields.io/badge/Status-Online-brightgreen) |
| 🛠️ **Admin Dashboard** | Menu management, customer orders & driver GPS tracking | [https://feasto-admin-567d.onrender.com](https://feasto-admin-567d.onrender.com) | ![Live](https://img.shields.io/badge/Status-Online-brightgreen) |
| ⚙️ **Backend REST API** | Express.js API, JWT auth, Razorpay and Gemini services | [https://feasto-backend-pcbq.onrender.com](https://feasto-backend-pcbq.onrender.com) | ![Live](https://img.shields.io/badge/Status-Online-brightgreen) |
| 🩺 **System Health Probe**| Uptime, timestamp, and process diagnostics | [https://feasto-backend-pcbq.onrender.com/api/health](https://feasto-backend-pcbq.onrender.com/api/health) | ![Healthy](https://img.shields.io/badge/Health-200%20OK-brightgreen) |

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Monorepo Project Structure](#-monorepo-project-structure)
- [REST API Reference](#-rest-api-reference)
- [Environment Configuration](#-environment-configuration)
- [Getting Started (Local Development)](#-getting-started-local-development)
- [Docker & Containerized Deployment](#-docker--containerized-deployment)
- [Automated Testing & Quality Suite](#-automated-testing--quality-suite)
- [CI/CD & Production Deployment](#-cicd--production-deployment)
- [Security & Production Hardening](#-security--production-hardening)
- [Application Flow & Interfaces](#-application-flow--interfaces)
- [Troubleshooting](#-troubleshooting)
- [Developer & Contact](#-developer--contact)

---

## 🏗 System Architecture

Feasto is architected as a modular, three-tier micro-service system orchestrating frontends, backend APIs, external CDNs, payment gateways, and generative AI services:

```mermaid
flowchart TD
    CustomerBrowser["Customer Client\n(React 18 + Vite + Leaflet)"]
    AdminBrowser["Admin Client\n(React 18 + Vite + Tailwind)"]

    subgraph CDNIngress["Edge & Reverse Proxy Layer"]
        RenderRouter["Render Edge Router & SSL Termination"]
    end

    subgraph BackendAPI["Feasto Backend API (Node.js 20 • Express 4.21)"]
        CORSMiddleware["Dynamic CORS Filter\n(Regex Vite Dev + Render)"]
        AuthGates["Role-Scoped JWT Security\n(Customer vs Admin Tokens)"]
        Controllers["Controllers & Business Services\n(User • Food • Cart • Order • Tracking)"]
        AIEngine["Gemini 3.0 AI Concierge\n(gemini-3.8-flash)"]
    end

    subgraph DataPersistence["Storage & Cloud Infrastructure"]
        MongoDB[("MongoDB Atlas / Docker Mongo 7.0\n(Users • Foods • Orders • Carts)")]
        Cloudinary[("Cloudinary Media CDN\n(Image Resizing & Transformations)")]
        Razorpay[("Razorpay Payment Gateway\n(HMAC-SHA256 Signatures)")]
    end

    CustomerBrowser -->|HTTPS| RenderRouter
    AdminBrowser -->|HTTPS| RenderRouter
    RenderRouter --> CORSMiddleware --> AuthGates --> Controllers
    Controllers --> MongoDB
    Controllers -->|Multi-part Uploads| Cloudinary
    Controllers -->|Order & Signature Verify| Razorpay
    Controllers -->|Menu Context & Inference| AIEngine
```

---

## ✨ Key Features

### 1. 🚪 Mandatory Authentication Gate (`WelcomeGate`)
- **Protected Browsing:** Clear, elegant entry screen requiring authentication (Sign In, Sign Up, or Admin portal navigation) before accessing menu and checkout flows.
- **Strict Session Isolation & Secure Data Wipe:** Complete purging of JWT tokens, cached carts, profile records, and active order states on logout, eliminating cross-session data leakage.

### 2. 🗺️ Live Driver Geolocation Tracking Map
- **Interactive OpenStreetMap Visualization:** Built with **Leaflet** and **React-Leaflet**, featuring customized animated delivery rider markers and restaurant store pinpoints.
- **Real-Time GPS Synchronization:** Driver coordinates updated by administrators are immediately broadcast to customer tracking views (`/order/tracking/:orderId`).

### 3. 🤖 Google Gemini 3.0 Generative AI Food Concierge
- **Next-Gen Model:** Powered by Google's latest `gemini-3.8-flash` model.
- **Context-Aware Recommendations:** Automatically parses the active restaurant menu and recent user order history to recommend dishes tailored to guest cravings and dietary preferences.
- **Native Rupee Formatting:** Strict prompt engineering ensures all dish prices and calculations are rendered natively in Indian Rupees (`₹`).

### 4. 💳 Tamper-Proof Razorpay Payment & Ordering Engine
- **Server-Side Price Recalculation:** Client-submitted cart prices are completely discarded; totals, taxes, and delivery fees are recomputed directly from database records.
- **Cryptographic Signature Verification:** Enforces server-side HMAC-SHA256 signature verification before marking orders confirmed.

### 5. 🛠️ Comprehensive Restaurant Admin Dashboard
- **Menu Management:** Add, update, and remove menu items with automated Cloudinary image uploads and category classifications.
- **Live Order Management:** Real-time visibility into incoming orders with status progression (*Food Processing* ➔ *Out for Delivery* ➔ *Delivered*).
- **Rider Dispatch Control:** Start delivery sessions, update driver latitude/longitude positions, and terminate tracking trips upon successful handover.

---

## 🛠 Technology Stack

| Domain | Technology / Service | Purpose |
| :--- | :--- | :--- |
| **Frontend Clients** | React 18, Vite, React Router DOM | High-performance SPA with client-side routing |
| **Mapping & Geolocation** | Leaflet.js, React-Leaflet, OpenStreetMap | Interactive live delivery tracking maps |
| **Styling & Icons** | CSS3 Modern Grid, Lucide React, React Toastify | Responsive UI, interactive alerts, and iconography |
| **Backend Runtime** | Node.js (v20+ LTS, ES Modules) | Asynchronous backend execution environment |
| **API Framework** | Express.js 4.21 | RESTful routing, error shielding, and middleware chaining |
| **Database & ODM** | MongoDB Atlas / Mongoose 8.13 | Schematized persistence for accounts, menu, and orders |
| **Generative AI** | Google Gemini 3.0 (`gemini-3.8-flash`) | Contextual food concierge and dish recommender |
| **Payment Gateway** | Razorpay Node.js SDK | Order generation and HMAC-SHA256 signature verification |
| **Asset Storage** | Cloudinary & Multer | Secure cloud media upload and automated thumbnailing |
| **Security & Auth** | JSON Web Tokens (jsonwebtoken), BcryptJS | Role-separated token auth and password hashing |
| **Containerization** | Docker, Docker Compose, Nginx | Multi-container Alpine builds and static web servers |
| **Testing** | Node.js Test Runner (`node:test`) | Native, zero-dependency unit and integration testing |
| **CI/CD** | GitHub Actions | Automated linting, test verification, and container builds |
| **Hosting** | Render Cloud Platform | Fully managed deployment with automatic zero-downtime rollouts |

---

## 📁 Monorepo Project Structure

```text
Feasto/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions automated test & build pipeline
├── admin/                     # Restaurant management React SPA
│   ├── src/
│   │   ├── assets/            # Static icons and logos
│   │   ├── components/        # Sidebar, Navbar, and Order modals
│   │   └── pages/             # Add Food, List Food, Orders, Driver Tracking
│   ├── Dockerfile             # Multi-stage Dockerfile (Vite Build + Nginx Alpine)
│   ├── nginx.conf             # Production Nginx reverse proxy configuration
│   └── package.json           # Admin dependencies and build scripts
├── backend/                   # Express.js REST API service
│   ├── config/                # Database, Cloudinary, Razorpay, and Env configs
│   ├── controllers/           # Auth, Food, Cart, Order, and Assistant logic
│   ├── middleware/            # Auth, AdminAuth, RateLimit, and Error handlers
│   ├── models/                # Mongoose schemas (User, Food, Order, Tracking)
│   ├── routes/                # Express route routers
│   ├── tests/                 # Native test suite (18 unit & integration tests)
│   ├── Dockerfile             # Production Node 20 Alpine container
│   ├── package.json           # Backend dependencies and test runner config
│   └── server.js              # Application entry point and CORS gate
├── frontend/                  # Customer-facing React SPA
│   ├── src/
│   │   ├── components/        # Navbar, Hero, FoodDisplay, Cart, AI Assistant, Map
│   │   ├── context/           # StoreContext (Global state & cart sync)
│   │   └── pages/             # Home, Cart, PlaceOrder, MyOrders, LiveTracking
│   ├── Dockerfile             # Multi-stage Dockerfile (Vite Build + Nginx Alpine)
│   ├── nginx.conf             # Production Nginx SPA routing rules
│   └── package.json           # Customer app dependencies and scripts
├── .env.example               # Safe environment variable template
├── compose.yaml               # Full-stack multi-container Docker Compose blueprint
├── README.md                  # Comprehensive root documentation
└── render.yaml                # Infrastructure-as-Code specification for Render
```

---

## 📡 REST API Reference

All backend endpoints are prefixed with `/api`. For complete technical details, see [`backend/README.md`](./backend/README.md).

### Customer & Admin Auth
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/user/register` | Public | Register new customer account |
| `POST` | `/api/user/login` | Public (Rate-Limited) | Authenticate customer and issue customer JWT |
| `POST` | `/api/admin/login` | Public (Rate-Limited) | Authenticate administrator and issue admin JWT |

### Food Catalog
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/food/list` | Public | Retrieve all dishes with Cloudinary image URLs |
| `POST` | `/api/food/add` | **Admin Only** | Upload image and add new dish to catalog |
| `POST` | `/api/food/remove` | **Admin Only** | Delete dish from catalog and database |

### Cart Operations
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/cart/get` | **Customer** | Fetch synchronized cart items and counts |
| `POST` | `/api/cart/add` | **Customer** | Increment item quantity in cart |
| `POST` | `/api/cart/remove` | **Customer** | Decrement item quantity in cart |
| `POST` | `/api/cart/merge` | **Customer** | Merge local guest cart into authenticated cloud cart |

### Orders & Live Delivery Tracking
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/order/place` | **Customer** | Recalculate verified bill & initialize Razorpay order |
| `POST` | `/api/order/verify` | **Customer** | Cryptographically verify HMAC-SHA256 signature |
| `POST` | `/api/order/userorders` | **Customer** | Fetch customer's personal order history |
| `GET` | `/api/order/tracking/:orderId` | **Customer** | Fetch real-time driver coordinates and delivery stage |
| `GET` | `/api/order/list` | **Admin Only** | View all orders across all customers |
| `POST` | `/api/order/status` | **Admin Only** | Update order state (*Food Processing*, *Out for Delivery*, *Delivered*) |
| `POST` | `/api/order/tracking/start` | **Admin Only** | Start driver trip session |
| `POST` | `/api/order/tracking/location`| **Admin Only** | Push live driver GPS coordinates |
| `POST` | `/api/order/tracking/stop` | **Admin Only** | Mark delivery completed and stop tracking |

### AI Travel & Dining Assistant
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/assistant/chat` | Public / Optional Auth | Query Google Gemini 3.0 for contextual food guidance |

---

## 🔐 Environment Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

| Variable | Target Service | Required | Description | Example / Default |
| :--- | :--- | :---: | :--- | :--- |
| `PORT` | Backend | Optional | Port the backend server binds to | `4000` |
| `MONGODB_URI` | Backend | **Yes** | MongoDB connection string (Atlas or Docker) | `mongodb+srv://user:pass@cluster.mongodb.net/feasto` |
| `JWT_SECRET` | Backend | **Yes** | Secret used for signing JWT tokens | Random 32+ character string |
| `ADMIN_EMAIL` | Backend | **Yes** | Authorized administrative login email | `admin@feasto.com` |
| `ADMIN_PASSWORD` | Backend | **Yes** | Authorized administrative login password | `strongAdminPassword` |
| `FRONTEND_URL` | Backend | **Yes** | Origin URL of the customer frontend | `https://feasto-frontend-qt0n.onrender.com` |
| `ADMIN_URL` | Backend | **Yes** | Origin URL of the admin dashboard | `https://feasto-admin-567d.onrender.com` |
| `CLOUDINARY_NAME` | Backend | **Yes** | Cloudinary Cloud Name | `your_cloudinary_name` |
| `CLOUDINARY_API_KEY`| Backend | **Yes** | Cloudinary API Key | `your_cloudinary_key` |
| `CLOUDINARY_SECRET_KEY`| Backend| **Yes** | Cloudinary API Secret | `your_cloudinary_secret` |
| `RAZORPAY_KEY_ID` | Backend & Frontend | **Yes** | Razorpay Key ID | `rzp_test_yourKeyId` |
| `RAZORPAY_KEY_SECRET`| Backend | **Yes** | Razorpay Key Secret | `your_razorpay_secret` |
| `GEMINI_API_KEY` | Backend | **Yes** | Google Gemini 3.0 API Key | `AIzaSy...` |
| `GEMINI_MODEL` | Backend | Optional | Generative AI model name | `gemini-3.8-flash` |
| `VITE_BACKEND_URL` | Frontend & Admin | **Yes** | Base URL of the backend API service | `https://feasto-backend-pcbq.onrender.com` |

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js:** v20.x or higher LTS
- **npm:** v10.x or higher
- **MongoDB:** MongoDB Atlas connection string or local MongoDB instance

### 2. Clone Repository
```bash
git clone https://github.com/AyushKumar-12345/Feasto.git
cd Feasto
```

### 3. Native Node.js Execution (3 Terminals)

#### Terminal 1: Backend API (Port 4000)
```bash
cd backend
npm install
npm run server
```

#### Terminal 2: Customer Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

#### Terminal 3: Admin Dashboard (Port 5174)
```bash
cd admin
npm install
npm run dev
```

---

## 🐳 Docker & Containerized Deployment

Feasto includes a production-grade multi-container `compose.yaml` orchestrating the complete application stack:

```mermaid
flowchart LR
    subgraph HostSystem["Host Machine"]
        Port5173["Port 5173: Customer App"]
        Port5174["Port 5174: Admin Dashboard"]
        Port4000["Port 4000: Backend API"]
        MongoVolume[("Volume: feasto_mongodb_data")]
    end

    subgraph DockerNetwork["Internal Bridge Network: feasto-network"]
        FEContainer["feasto-frontend\n(Nginx Alpine)"]
        AdminContainer["feasto-admin\n(Nginx Alpine)"]
        BEContainer["feasto-backend\n(Node 20 Alpine)"]
        DBContainer["feasto-mongodb\n(MongoDB 7.0 Jammy)"]
    end

    Port5173 --> FEContainer
    Port5174 --> AdminContainer
    Port4000 --> BEContainer
    FEContainer & AdminContainer -->|API Calls| BEContainer
    BEContainer -->|Internal DNS| DBContainer
    DBContainer --> MongoVolume
```

### Run Full Stack with Docker Compose
```bash
# 1. Prepare environment file
cp .env.example .env

# 2. Build and launch all services in detached mode
docker compose up --build -d

# 3. Check health and running status
docker compose ps

# 4. View logs
docker compose logs -f backend

# 5. Stop services (preserving database volume)
docker compose down
```

---

## 🧪 Automated Testing & Quality Suite

Feasto includes 18 automated unit and integration tests executing with zero external dependencies via Node's native test runner (`node:test`):

```bash
# Run backend test suite
npm --prefix backend test
```

### Test Suite Execution Output:
```text
TAP version 13
✔ askAssistant rejects empty message with 400
✔ askAssistant rejects invalid history with 400
✔ askAssistant returns 503 if no Gemini API key is provided
✔ customer auth requires a well-formed bearer token and refuses admin credentials
✔ customer auth rejects old, expired, and inconsistent JWT claims
✔ customer auth takes the principal from the token and checks the account exists
✔ customer auth rejects tokens for deleted accounts
✔ admin auth accepts only a scoped admin token
✔ optional customer auth allows guests but validates any provided token
✔ checkout uses the authenticated customer and server menu prices
✔ payment verification scopes order lookup to the authenticated customer
✔ guest cart merge adds quantities to the signed-in cart and caps item quantities
✔ guest cart merge rejects malformed item quantities
✔ repeating a completed guest cart merge does not add the cart twice
✔ GET / returns 200 with API status message
✔ GET /api/health returns 200 with status ok and uptime
✔ 404 catch-all returns 404 with structured error response
✔ CORS validator logic permits local Vite dev origins and blocks untrusted domains

18 tests passed (100% success rate)
```

---

## 🔄 CI/CD & Production Deployment

Feasto features an enterprise-grade automated CI/CD pipeline defined in [`.github/workflows/ci-cd.yml`](./.github/workflows/ci-cd.yml):

```mermaid
flowchart TD
    GitPush["git push origin main"] --> CIWorkflow["GitHub Actions CI Pipeline"]
    
    subgraph Job1["Lint, Test & Build"]
        BE_Test["Backend: npm ci & npm test (18 Tests Passed)"]
        FE_Lint["Frontend: ESLint & Vite Production Build"]
        Admin_Lint["Admin: ESLint & Vite Production Build"]
    end

    subgraph Job2["Container Verification"]
        DockerBuildx["Docker Buildx Multi-Stage Verification"]
        BE_Img["Build feasto-backend Image"]
        FE_Img["Build feasto-frontend Image"]
        Admin_Img["Build feasto-admin Image"]
    end

    CIWorkflow --> Job1
    CIWorkflow --> Job2
    Job1 & Job2 --> PassGate["CI Quality Gate Passed ✅"]
    PassGate --> RenderDeploy["Render Auto-Deploy Webhook\n(Zero-Downtime Live Rollout 🚀)"]
```

---

## 🔒 Security & Production Hardening

- **Audience-Separated JWTs:** Distinct cryptographic token audiences ensure customer credentials cannot be used to execute administrative actions.
- **Server-Side Price Validation:** Protects against client-side cart tampering by strictly recalculating order costs directly from database records.
- **Cryptographic Signature Verification:** Enforces HMAC-SHA256 signature checks on all Razorpay payments.
- **Brute-Force Rate Limiting:** Rate limiters protect authentication endpoints (`/api/user/login`, `/api/admin/login`) and AI endpoints.
- **Non-Root Container Security:** Backend Dockerfile executes as unprivileged user `node`, and frontends are served via hardened Nginx Alpine images.

---

## 🖥 Application Flow & Interfaces

| Screen / Feature | Route / URL | Core Responsibilities & User Experience |
| :--- | :--- | :--- |
| **Welcome Gate** | `/` (Unauthenticated) | Brand hero banner, value proposition, and modal sign-in/sign-up gate ensuring session isolation. |
| **Menu Catalog** | `/` | Category filters (*Fresh & Crisp*, *Savory & Hearty*, *Sweet Treats*), live search bar, and dynamic dish cards. |
| **Food Concierge** | Floating Widget | Context-aware AI assistant driven by Google Gemini 3.0 answering guest questions and recommending dishes in INR (`₹`). |
| **Shopping Cart** | `/cart` | Item quantity increments/decrements, verified itemized subtotal, delivery fee, and promo calculations. |
| **Checkout & Razorpay**| `/order` | Delivery address form, server order initialization, and secure Razorpay payment modal with signature verification. |
| **My Orders** | `/myorders` | Past order receipts, live order states (*Food Processing*, *Out for Delivery*, *Delivered*), and direct tracking links. |
| **Live Driver Map** | `/tracking/:id` | Leaflet & OpenStreetMap interactive map displaying live animated delivery rider coordinates and destination pin. |
| **Admin Food Manager**| `admin/add`, `admin/list`| Uploading high-res dish photos to Cloudinary, setting price & categories, and toggling availability. |
| **Admin Order Center** | `admin/orders` | Live order dashboard with one-click status transitions and live driver GPS dispatch controls. |

---

## 🩺 Troubleshooting

### 1. MongoDB Atlas SRV Connection Refused (`querySrv ENODATA`)
- **Cause:** Certain local Windows networks block DNS SRV lookups utilized by `mongodb+srv://`.
- **Solution:** Feasto includes automatic DNS fallback to Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) in `backend/config/loadEnv.js`. If using Docker Compose, the local `mongodb` service is used automatically.

### 2. Port Already in Use (`EADDRINUSE`)
- **Cause:** Another process is utilizing port 4000, 5173, or 5174.
- **Solution:** Run `docker compose down` or kill the process:
  ```powershell
  # Windows PowerShell:
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force
  ```

### 3. Missing Cloudinary / Razorpay Credentials
- **Cause:** Missing environment variables in `.env`.
- **Solution:** Copy `.env.example` to `.env` and provide valid API keys. For testing without payment or image uploads, placeholder strings can be used.

---

## 👨‍💻 Developer & Contact

**Ayush Kumar**  
*Information Technology | IIIT Bhubaneswar*  

- **Portfolio:** [https://ayush-portfolio-3yan.onrender.com](https://ayush-portfolio-3yan.onrender.com)
- **LinkedIn:** [linkedin.com/in/ayush-kumar-97326636a](https://www.linkedin.com/in/ayush-kumar-97326636a/)
- **GitHub:** [github.com/AyushKumar-12345](https://github.com/AyushKumar-12345)
- **Email:** [ayushkumardandapat200@gmail.com](mailto:ayushkumardandapat200@gmail.com)

---

<div align="center">
  <sub>Built with ❤️ by Ayush Kumar • Feasto Food Delivery Ecosystem</sub>
</div>
