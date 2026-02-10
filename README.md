# MYSTOCK API

A robust GraphQL-based stock management system built with Node.js, Express, and MongoDB. This application provides comprehensive tools for managing products, categories, units, and financial accounting.

## 🚀 Features

- **User Authentication**: Secure register, login, logout, OTP-based password reset, and role management.
- **Stock Management**: CRUD operations for stock items with pagination, filtering (by category, unit, status, year), and detailed statistics.
- **Category & Unit Management**: Organize stocks efficiently with customizable categories and units.
- **Accounting & Finances**: Track profit/loss, net changes, and generate yearly financial breakdowns.
- **Security**: Implemented rate limiting, Helmet for security headers, CORS configuration, and JWT authentication.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
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
```

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
