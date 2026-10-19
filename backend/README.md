# ⚙️ Feasto Backend API

The Express.js REST API service powering the **Feasto** food delivery platform. It handles authentication, menu catalog, cart operations, Razorpay payment verification, real-time order lifecycle tracking, and contextual AI assistance using Google Gemini 3.0.

---

## 🚀 Features

* **JWT Authentication**: Role-separated customer and admin token validation with claim verification and account checks.
* **Menu Catalog API**: Endpoints to list, create, and remove menu items with Cloudinary media storage.
* **Cart Operations**: Synchronized, server-validated shopping cart operations.
* **Order Management & Payment**: Order placement, Razorpay payment verification with HMAC signature checks, and status tracking (*Food Processing*, *Out for Delivery*, *Delivered*).
* **Live Delivery Tracking**: Real-time driver coordinate management for Leaflet & OpenStreetMap interactive maps.
* **AI Food Assistant**: Context-aware dish recommendations and ordering support powered exclusively by **Google Gemini 3.0** (`gemini-3.8-flash`) with native Indian Rupee (`₹`) pricing.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js 4.x
* **Database:** MongoDB Atlas with Mongoose ODM
* **AI / LLM:** Google Gemini 3.0 REST API (`gemini-3.8-flash`)
* **Payments:** Razorpay Node.js SDK
* **Media Storage:** Cloudinary & Multer
* **Security & Auth:** JSON Web Tokens (jsonwebtoken), bcryptjs, validator
* **Testing:** Built-in Node.js test runner (`node --test`)

---

## 💻 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in the repository-root `.env`:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_EMAIL=admin@feasto.com
   ADMIN_PASSWORD=your_admin_password
   FRONTEND_URL=http://localhost:5173
   ADMIN_URL=http://localhost:5174
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-3.8-flash
   ```

3. Run automated tests:
   ```bash
   npm test
   ```

4. Start the server:
   ```bash
   npm run server
   ```

5. Health check endpoint:
   ```bash
   curl http://localhost:4000/api/health
   ```

6. Build and run via Docker:
   ```bash
   docker build -t feasto-backend:latest .
   docker run -d --name feasto-backend -p 4000:4000 --env-file ../.env feasto-backend:latest
   ```


