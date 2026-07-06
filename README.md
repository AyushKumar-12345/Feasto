# 🍔 Feasto – Full Stack Food Delivery Platform

Feasto is a modern full-stack food delivery platform inspired by applications like **Zomato** and **Swiggy**. It enables users to browse food items, manage their cart, place orders, complete secure online payments, and track their orders. The platform also includes a dedicated admin dashboard for managing food items and customer orders.

---

## 🚀 Features

### 👤 User Features

- User Registration & Login (JWT Authentication)
- Browse Food Menu
- Search Food Items
- Filter Food by Category
- Add & Remove Items from Cart
- Shopping Cart Management
- Place Food Orders
- Secure Online Payments using Razorpay
- View Order History
- Upload Profile Picture
- Responsive User Interface

### 🛠️ Admin Features

- Secure Admin Login
- Add New Food Items
- Upload Images using Cloudinary
- View All Food Items
- Delete Food Items
- View Customer Orders
- Update Order Status
- Order Management Dashboard

---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Axios
- React Toastify
- Lucide React
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary
- Multer

### Deployment

- Frontend – Render
- Admin Dashboard – Render
- Backend API – Render
- Database – MongoDB Atlas

---

## 📁 Project Structure

```text
Feasto/
│
├── frontend/
├── backend/
├── admin/
└── README.md
```

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/Feasto.git

cd Feasto
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

### Backend

```bash
cd backend

npm install

npm run server
```

---

### Admin Panel

```bash
cd admin

npm install

npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

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

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Admin (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Food Menu
- Cart
- Checkout
- Payment
- My Orders
- Profile Page
- Admin Dashboard
- Order Management

---

## 🌟 Future Improvements

- Wishlist Feature
- Coupon & Discount System
- Live Order Tracking
- Email Notifications
- Push Notifications
- User Address Management
- Multiple Payment Methods
- Food Reviews & Ratings

---

## 📄 License

This project was developed for learning, portfolio, and demonstration purposes.

---

## 👨‍💻 Author

**Ayush Kumar**

- GitHub: https://github.com/AyushKumar-12345
- LinkedIn: https://www.linkedin.com/in/ayush-kumar-97326636a/