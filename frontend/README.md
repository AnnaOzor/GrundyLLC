# Grundy LLC - Grocery Marketplace

Grundy LLC is a Nigerian startup connecting open-air markets and grocery shops to customers via a marketplace app, with last-mile fulfillment handled by delivery riders.  

This repository contains both the **backend API** and instructions for the **frontend application**.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Payment Integration](#payment-integration)
- [Webhook](#webhook)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features
- Browse groceries and merchants
- Shopping cart & checkout
- Order management
- Multiple payment methods:
  - Online checkout via Paystack
  - Bank transfer via dedicated virtual accounts
  - Terminal (simulated) payments
- Merchant management
- Webhook for automatic payment confirmation

---

## Tech Stack
**Backend**
- Node.js & Express
- MongoDB & Mongoose
- Paystack API for payments

**Frontend**
- React
- Axios for API calls
- Tailwind CSS (optional)

---

## Getting Started

### Backend Setup
1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file in backend root with the following variables:
```ini
PORT=4000
MONGO_URI=your_mongodb_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret_key
GRUNDY_SUBACCOUNT=your_grundy_subaccount_code
```
4. Start the server:
```bash
npm run server
```
Backend runs at http://localhost:4000

### Frontend Setup
1. Navigate to the frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file if needed (e.g., API URLs):
```bash
REACT_APP_API_URL=http://localhost:4000/api
```
4. Start the frontend:
```bash
npm run dev
```
Frontend runs at http://localhost:5173
Admin runs at http://localhost:5174

## API Endpoints
### Grocery
1. GET /api/grocery - List groceries
2. POST /api/grocery - Add grocery (admin)

### User
1. POST /api/user/signup - Register user
2. POST /api/user/login - Login

### Cart
1. POST /api/cart - Add to cart
2. GET /api/cart/:userId - Get user cart

### Orders
1. POST /api/order - Create order
2. GET /api/order/:userId - Get user orders

### Merchant
1. POST /api/merchant/signup - Register a new merchant account
2. POST /api/merchant/login - Authenticate merchant and return JWT token
3. GET /api/merchant/me - Return the currently logged-in merchant’s details (from token)
4. GET /api/merchant/dashboard - Get merchant dashboard info (name, email, phone, category, subaccount code, etc.)
5. GET /api/merchant/find?email={email} or /api/merchant/find?name={name} - Search merchants by email or name (partial or exact match)
6. GET /api/merchant/all - Retrieve all registered merchants
7. GET /api/merchant/:id - Get details of a single merchant by ID

### Payments
1. POST /api/payment/online - Pay online via Paystack
2. POST /api/payment/bank-transfer - Assign virtual account for bank transfer
3. POST /api/payment/terminal - Simulate terminal payment

### Webhook
1. POST /api/paystack/webhook — Receives Paystack events for payment updates

## Payment Flow
### Online Payment
1. Client calls /api/payment/online
2. Payment initialized with Paystack
3. Payment reference saved in order
4. Paystack webhook confirms payment → order marked Paid

### Bank Transfer
1. Client calls /api/payment/bank-transfer
2. Dedicated virtual account assigned per order
3. Customer transfers money to the virtual account
4. Paystack webhook updates order on successful payment

### Terminal Payment
1. Client calls /api/payment/terminal (simulated)
2. Payment status and reference saved

## Webhook Setup
1. Use ngrok to expose local server:
```bash
ngrok http 4000
```
2. Set webhook in Paystack dashboard:
```
https://<ngrok-id>.ngrok-free.dev/api/paystack/webhook
```
3. Ensure raw body parsing is enabled for webhook in server.js:
```js
app.use("/api/paystack", express.raw({ type: "application/json" }), paystackRoute);
```

## Testing
Use Postman or curl to test endpoints:
```bash
# Test webhook
curl -X POST https://<ngrok-id>.ngrok-free.dev/api/paystack/webhook \
-H "Content-Type: application/json" \
-H "x-paystack-signature: faketest" \
-d '{
  "event": "charge.success",
  "data": { "metadata": { "order_id": "123456" } }
}'
```

## File Structure
```bash
backend/
├─ controllers/
│  ├─ paymentController.js
│  ├─ paystackWebhookController.js
├─ models/
│  ├─ merchantModel.js
│  ├─ orderModel.js
├─ routes/
│  ├─ paymentRoute.js
│  ├─ paystackRoute.js
│  ├─ groceryRoute.js
│  └─ ...
├─ utils/
│  └─ paystack.js
├─ server.js
├─ package.json
└─ .env
```
## Notes
- Signature verification is critical for Paystack webhook security. Never disable it in production.
- Virtual accounts are required only for bank transfer payments, not online card payments.
- Terminal payments are currently simulated; integrate real terminal APIs for production.