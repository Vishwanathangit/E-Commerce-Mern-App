# E-Commerce MERN App 🛒

This project is a complete **E-Commerce application** built using the **MERN stack (MongoDB, Express, React, Node.js)**. It includes user authentication, product management, cart system, checkout flow, and an admin dashboard.

---

## 📁 File Structure

<pre>
  ```
  ecommerce-mern-app/
├── backend/
│ ├── config/ # MongoDB & Stripe config
│ ├── controllers/ # Product, user, order logic
│ ├── middleware/ # Auth, admin check, error handler
│ ├── models/ # Mongoose models (User, Product, Order)
│ ├── routes/ # API route definitions
│ ├── utils/ # Token generator, validations
│ └── server.js # Entry point for Express server

├── frontend/
│ ├── public/ # Static files
│ └── src/
│ ├── components/ # Reusable components (Navbar, ProductCard)
│ ├── pages/ # Screens like Home, Cart, Product, Admin
│ ├── redux/ # Redux Toolkit store, slices
│ ├── services/ # Axios service logic
│ ├── App.js # Main app file with routes
│ └── main.jsx # React entry file

├── .env # Environment variables
├── package.json # Project dependencies
└── README.md # This file
  ```
</pre>


---

## 🔐 Features

- User Signup / Login with JWT auth
- Admin dashboard to manage users/products/orders
- Product catalog with categories & details
- Add to cart, quantity update, and delete
- Order placement with payment method
- Stripe integration for online payments (optional)
- Protected routes for user/admin access

---

## 🚀 Tech Stack

**Frontend**: React, Redux Toolkit, Axios, Tailwind CSS  
**Backend**: Node.js, Express, MongoDB (Mongoose)  
**Authentication**: JWT, Cookies  
**Payments**: Stripe API

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint        | Description             |
|--------|------------------|-------------------------|
| POST   | `/register`      | Register new user       |
| POST   | `/login`         | Login and return token  |
| GET    | `/logout`        | Logout and clear cookie |

### Products (`/api/products`)
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/`               | Get all products         |
| POST   | `/`               | Create new product (admin) |
| PUT    | `/:id`            | Update product (admin)   |
| DELETE | `/:id`            | Delete product (admin)   |

### Orders (`/api/orders`)
| Method | Endpoint         | Description                 |
|--------|------------------|-----------------------------|
| POST   | `/`              | Place a new order           |
| GET    | `/my-orders`     | Get logged-in user orders   |
| GET    | `/`              | Get all orders (admin)      |
| PUT    | `/:id/status`    | Update order status (admin) |

### Cart (`/api/cart`)
| Method | Endpoint   | Description               |
|--------|------------|---------------------------|
| POST   | `/add`     | Add product to cart       |
| PUT    | `/update`  | Update quantity in cart   |
| DELETE | `/remove`  | Remove item from cart     |
| GET    | `/`        | Get user cart items       |

---

## 🛠 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/YourUsername/E-Commerce-MERN-App.git
cd E-Commerce-MERN-App
```

### 2. Configure Environment Variables
Create a .env file in the root:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key (optional)
FRONTEND_URL=http://localhost:5173
PORT=5000

### 3. Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

### 4. Run the App
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev

