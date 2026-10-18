# 🍔 Feasto Frontend

The frontend of **Feasto**, a modern food delivery web application built using **React** and **Vite**. It delivers a fast, responsive, and intuitive user experience, allowing users to explore food items, manage their cart, complete secure online payments, and track their orders in real time.

---

## ✨ Features

- 🚪 **Mandatory Welcome Gate (`WelcomeGate`)**: Dedicated entry screen requiring customer Sign In, Sign Up, or Admin access before entering the store (no unauthenticated guest browsing).
- 🔐 **Strict Session Isolation & Complete Data Wipe**: Full wipe of token, user details, cart, and profile on logout—preventing cross-user data leakage.
- 🗺️ **Interactive Live Delivery Tracking Map**: Real-time order tracking powered by **Leaflet** & **OpenStreetMap** with animated driver coordinates.
- 🤖 **Smart AI Assistant (Google Gemini 3.0)**: Contextual dish recommendations powered by `gemini-3.8-flash` with Indian Rupee (`₹`) pricing and markdown bullet formatting.
- 🍽️ **Appetizing Hero & Craving Filters**: Quick category filtering for *Fresh & Crisp*, *Savory & Hearty*, and *Sweet Treats*.
- 🔍 **Real-Time Menu Search**: Instant fuzzy filtering by dish name and category.
- 🛒 **Persistent Shopping Cart**: Synchronized cart items with backend validation.
- 💳 **Secure Online Payments**: Integrated Razorpay checkout with server-side HMAC payment verification.
- 📦 **Order History & Real-Time Tracking**: Full order lifecycle (*Food Processing*, *Out for Delivery*, *Delivered*).
- 👤 **Minimalist User Profile**: Clean card design with photo upload and account details.
- 📄 **Information & Support Pages**: Contact form, privacy policy, terms of use.
- 📱 **Fully Responsive UI**: Mobile-first, tablet, and desktop optimized design.

---

## 🛠 Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- React Toastify
- Lucide React
- CSS3
- Leaflet with OpenStreetMap tiles
- AI Assistant integration (Google Gemini 3.0) through the backend (API key is server-side)
- Razorpay Checkout

---

## 📂 Project Structure

```
src/
│
├── assets/
├── components/
├── context/
├── pages/
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Getting Started

Set `VITE_ADMIN_URL` in the shared repository-root `.env` to set the Admin
Dashboard destination. The welcome screen and navigation use the deployed
Feasto admin dashboard when this variable is unset.

### Clone the Repository

```bash
git clone <your-github-repository-url>
cd feasto-frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## ⚙️ Environment Variables

Set these values in the single `.env` file in the repository root.
`VITE_BACKEND_URL` should be the base URL of your shared backend; the customer
and admin frontends both read this value.

```env
# These are entries in the shared repository-root .env, not a separate file.
VITE_BACKEND_URL=http://localhost:4000
VITE_ADMIN_URL=http://localhost:5174
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
VITE_FORMSPREE_FORM_ID=your_form_id
```

To enable contact-form delivery, create a form at [Formspree](https://formspree.io/),
copy the ID from its endpoint (`https://formspree.io/f/{form_id}`), and put only
that ID in `VITE_FORMSPREE_FORM_ID`. Until configured, the form explains what's
missing and offers a direct email link. Formspree receives contact form
submissions; see the Privacy Policy.

For Render or another hosting provider, configure these values in that
service's environment settings (not in the repository):

- Customer frontend: `VITE_BACKEND_URL`, `VITE_ADMIN_URL`,
  `VITE_RAZORPAY_KEY_ID`, `VITE_FORMSPREE_FORM_ID`.
- Admin frontend: `VITE_BACKEND_URL`, `VITE_FRONTEND_URL`.
- Backend service: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD`, `FRONTEND_URL`, `ADMIN_URL`, Cloudinary credentials,
  Razorpay credentials, and `GEMINI_API_KEY` (Gemini 3.0 models).

Deploy the backend changes together with the frontends so the authenticated
`POST /api/cart/merge` endpoint is available when a customer signs in with a
saved guest cart.

`VITE_*` values are included in the public browser bundle. Only use them for
public URLs, the public Razorpay key ID, and the Formspree form ID. Never put
database credentials, JWT secrets, admin passwords, payment secrets, Cloudinary
secrets, or AI keys in a frontend environment.

---

## 🌐 Live Demo

- **Frontend:** https://feasto-frontend-qt0n.onrender.com
- **Admin Dashboard:** https://feasto-admin-567d.onrender.com
- **Backend API:** https://feasto-backend-pcbq.onrender.com

---

## 📦 Production Build

Build the application for production.

```bash
npm run build
```

---

## 👀 Preview Production Build

```bash
npm run preview
```

---

## 🔗 Backend

This frontend communicates with the **Feasto Backend** using REST APIs built with **Node.js**, **Express.js**, and **MongoDB**.

For local development, ensure the backend server is running before starting the frontend.

Configure `OPENAI_API_KEY` in the backend environment to enable the AI assistant.
Optionally set `OPENAI_MODEL`; the default is `gpt-4o-mini`. Never put the OpenAI
key in a `VITE_*` variable or expose it in the customer frontend.

---

## 📱 Pages

- Home
- Cart
- Checkout
- Order Verification
- My Orders
- Profile
- Login / Signup
- About Us
- Privacy Policy
- Terms of Use
- Contact & Support

---

## 📸 Screenshots

Add screenshots of the following pages after deployment:

- Home
- Cart
- Checkout
- My Orders
- Profile

---

## 🚀 Future Improvements

- Progressive Web App (PWA)
- Wishlist
- Dark Mode
- Email Notifications
- Push Notifications
- Real-time Delivery Tracking

---

## 👨‍💻 Author

**Ayush Kumar**

Built as a full-stack MERN portfolio project showcasing modern web development practices, responsive UI design, secure authentication, online payment integration, and RESTful API communication.

---

## 📄 License

This project is developed for educational and portfolio purposes.