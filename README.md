# 🍔 Feasto – Full Stack Food Delivery Platform

Feasto is a modern full-stack food delivery platform inspired by applications like **Zomato** and **Swiggy**. It allows users to browse food items, manage their cart, place orders, complete secure online payments, and track their orders. The platform also includes a dedicated admin dashboard for managing food items and customer orders.

---

# 🚀 Features

## 👤 User Features

- User Registration & Login (JWT Authentication)
- Browse Food Menu
- Search Food Items
- Filter Food by Category
- Add & Remove Items from Cart
- Shopping Cart Management
- Secure Checkout
- Razorpay Payment Integration
- Order History
- Order Status Tracking
- Profile Picture Upload
- Responsive UI
- Toast Notifications

## 🛠️ Admin Features

- Secure Admin Dashboard
- Add Food Items
- Delete Food Items
- Image Upload with Cloudinary
- View Customer Orders
- Update Order Status
- Restaurant Order Management

---

# 🛠 Tech Stack

## Frontend

- React 18
- Vite
- React Router DOM
- Axios
- React Toastify
- Lucide React
- CSS3

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary
- Multer

## Deployment

- Frontend — Render
- Admin Dashboard — Render
- Backend API — Render
- Database — MongoDB Atlas

---

# 🌐 Live Demo

### Frontend

https://feasto-frontend-qt0n.onrender.com

### Admin Dashboard

https://feasto-admin-567d.onrender.com

### Backend API

https://feasto-backend-pcbq.onrender.com

---

# 📁 Project Structure

```text
Feasto/
│
├── frontend/
├── backend/
├── admin/
└── README.md
```

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/your-username/Feasto.git
cd Feasto
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run server
```

## Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:5173

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

## Frontend (.env)

```env
VITE_BACKEND_URL=https://feasto-backend-pcbq.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Admin (.env)

```env
VITE_BACKEND_URL=https://feasto-backend-pcbq.onrender.com
```

---

# 📸 Screenshots

Add screenshots of:

- Home
- Food Menu
- Search
- Cart
- Checkout
- Razorpay Payment
- My Orders
- Profile
- Admin Dashboard
- Food Management
- Order Management

---

# 🚀 Future Improvements

- Wishlist
- Coupon & Discount System
- Live Order Tracking
- Email Notifications
- Push Notifications
- Multiple Delivery Addresses
- Food Reviews & Ratings
- Progressive Web App (PWA)
- Dark Mode

---

# 📄 License

This project is developed for educational and portfolio purposes.

---

# 👨‍💻 Author

**Ayush Kumar**

GitHub:
https://github.com/AyushKumar-12345

LinkedIn:
https://www.linkedin.com/in/ayush-kumar-97326636a/