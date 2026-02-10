# 📦 MYSTOCK API

### Stock Management & Accounting Backend

MYSTOCK API is a scalable and secure backend system for managing inventory, accounting, and financial operations within a business environment. It provides real-time stock tracking, automated accounting records, historical analytics, and decision-support insights to help businesses make informed decisions.

---

## 🚀 Overview

The system handles sales, purchases, inventory adjustments, shortages, and gains while automatically generating historical records and analytical summaries. Built with scalability and data integrity in mind, it supports both operational management and financial oversight.

---

## ✨ Key Features

### 📊 Inventory Management

- Real-time stock level tracking
- Monitoring shortages, gains, and adjustments
- Accurate product, category, unit, and warehouse records

### 💰 Accounting & Financial Tracking

- Sales and purchase transaction recording
- Automatic cost, profit, and loss calculations
- Financial consistency across all operations

### 🕒 Historical Data & Analytics

- Time-based sales and purchase reports
- Inventory trend and performance analysis
- Complete stock movement history

### 🧠 Decision Advisory System

- Identification of inventory risks (shortage / overstock)
- Data-driven purchasing and sales support
- Insights based on historical and current data

### 🔐 Secure & Scalable API

- JWT authentication and authorization
- Optimized performance and scalability
- Designed for web and mobile integration

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **API**: GraphQL (Apollo Server)
- **Database**: MongoDB (Mongoose)
- **Security**:
  - JWT
  - bcryptjs
  - Helmet
  - Express Rate Limit
- **Utilities**:
  - morgan
  - compression
  - cookie-parser
  - module-alias

---

## 📁 Project Structure

````text
myStock/
├── src/
│   ├── config/          # Configuration files (DB, security, rate limit)
│   ├── graphql/         # GraphQL schemas and resolvers
- **API**: GraphQL (Apollo Server)
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, bcryptjs, Helmet, Express-Rate-Limit
- **Utilities**: morgan, compression, cookie-parser, module-alias

## 📁 Project Structure

```text
myStock/
├── src/
│   ├── config/          # Configuration files (DB, security, rate limit)
│   ├── graphql/         # GraphQL schemas and resolvers
│   │   ├── accounting/
│   │   ├── category/
│   │   ├── stock/
│   │   ├── unit/
│   │   └── user/
│   └── utils/           # Helper functions and custom error classes
├── app.js               # Express application setup
├── index.js             # Entry point and server startup
└── .env                 # Environment variables
````

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and add the following:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/mystock
ACCESS_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
NODE_ENV=development
```

### Running the App

- **Development Mode**:
  ```bash
  npm run start:dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

## 📡 GraphQL API

Once the server is running, you can access the GraphQL Playground at:
`http://localhost:4000/graphql`

## 🔒 Security

- **JWT Authentication**: Protected routes require a valid Bearer token in the `Authorization` header.
- **Rate Limiting**: Protects against brute-force and DoS attacks.
- **Helmet**: Secures the app by setting various HTTP headers.
- **CORS**: Configured for secure cross-origin resource sharing.

## 📄 License

This project is licensed under the ISC License.
