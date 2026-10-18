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

- 🔐 Secure User Authentication (JWT)
- 🧭 Separate customer and admin sign-in with role-protected API operations
- 🍽️ Browse Food Menu
- 🔍 Search Food Items
- 🛒 Add & Remove Items from Cart
- 💳 Secure Online Payments with Razorpay
- 📦 Order Placement & Management
- 📜 Order History
- 🚚 Real-time Order Status Tracking
- 👤 User Profile Management
- 🖼️ Profile Picture Upload
- 🔔 Toast Notifications
- 📱 Fully Responsive Design
- 🤖 AI assistant for menu discovery, ordering help, and recent order questions
- 📷 Responsive homepage image carousel
- 📄 Privacy, terms, and contact pages

---

## 🛠️ Admin Features

- 🔑 Secure Admin Login
- 🍕 Add New Food Items
- 🗑️ Delete Food Items
- ☁️ Cloudinary Image Upload
- 📦 View Customer Orders
- 🔄 Update Order Status
- 📊 Restaurant Order Management Dashboard

---
# 🛠 Tech Stack

## 🎨 Frontend

- React 18
- Vite
- React Router DOM
- Axios
- React Toastify
- Lucide React
- CSS3

---

## ⚙️ Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary
- Multer

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
| Backend | `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_URL`, `ADMIN_URL`, `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |

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

## 7️⃣ Run the Project

### Start Backend

```bash
cd backend
npm run server
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Start Admin Dashboard

```bash
cd admin
npm run dev
```

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

- ❤️ Wishlist Functionality
- 🎟️ Coupon & Discount System
- 📍 Live Order Tracking
- 📧 Email Notifications
- 🔔 Push Notifications
- 🏠 Multiple Delivery Addresses
- ⭐ Food Ratings & Reviews
- 🌙 Dark Mode
- 📱 Progressive Web App (PWA)
- 🌍 Multi-language Support

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