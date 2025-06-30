# 📚 Bookstore API

A comprehensive RESTful API for managing an online bookstore built with NestJS, Prisma, and PostgreSQL. This API provides complete functionality for book management, user authentication, shopping cart operations, and order processing with role-based access control.

## 🚀 Features

### 📖 Core Functionality
- **Book Management**: Create, read, update, and delete books with genre categorization
- **Author Management**: Manage writers and their book associations
- **User Authentication**: JWT-based authentication with signup/login
- **Shopping Cart**: Add/remove books, manage quantities
- **Order Management**: Place orders, track status, cancel orders
- **Admin Panel**: Administrative controls for order and user management

### 🔐 Security & Authorization
- **Role-based Access Control**: Customer and Admin roles
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive data validation using class-validator
- **Password Encryption**: Bcrypt hashing for secure password storage

### 📊 Advanced Features
- **Pagination**: Efficient data loading with pagination support
- **Filtering & Search**: Advanced filtering for books, users, and orders
- **Stock Management**: Real-time inventory tracking
- **Transaction Safety**: Database transactions for critical operations
- **Global Exception Handling**: Centralized error management
- **Custom Logging**: Winston-based logging system

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Open source relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcrypt
- **Logging**: Winston

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bookstore-api.git
cd bookstore-api
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bookstore_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"
```


### 5. Start the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "0912345678",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Book Management

#### Get All Books
```http
GET /books?search=title&genre=FICTION
```

#### Get Single Book
```http
GET /books/:id
```

#### Create Book (Admin Only)
```http
POST /books
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "price": 1500,
  "stock": 50,
  "genre": "FICTION",
  "writerIds": [1, 2],
  "status": "ACTIVE"
}
```

#### Update Book
```http
PATCH /books/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 2000,
  "stock": 30
}
```

### Shopping Cart

#### Add Book to Cart
```http
POST /cart/books
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "bookId": 1
}
```

#### Get My Cart
```http
GET /cart
Authorization: Bearer <jwt_token>
```

#### Remove Book from Cart
```http
DELETE /cart/books/:bookId
Authorization: Bearer <jwt_token>
```

### Order Management

#### Create Order
```http
POST /orders
Authorization: Bearer <jwt_token>
```

#### Get My Orders
```http
GET /orders?page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Cancel Order
```http
PATCH /orders/:id/cancel
Authorization: Bearer <jwt_token>
```

### Admin Endpoints

#### Get All Orders (Admin)
```http
GET /admin/orders?status=PENDING&page=1&limit=10
Authorization: Bearer <admin_jwt_token>
```

#### Update Order Status (Admin)
```http
PATCH /admin/orders/:id
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "status": "SHIPPED"
}
```

## 🗄️ Database Schema

### Core Models

#### User
- `id` - Primary key
- `firstName` - User's first name
- `lastName` - User's last name
- `email` - Unique email address
- `phone` - Unique phone number
- `password` - Encrypted password
- `role` - USER | ADMIN
- `status` - ACTIVE | INACTIVE

#### Book
- `id` - Primary key
- `title` - Book title
- `price` - Price in cents
- `stock` - Available quantity
- `genre` - FICTION | NON_FICTION | MYSTERY | SCI_FI | FANTASY
- `status` - ACTIVE | INACTIVE

#### Order
- `id` - Primary key
- `userId` - Foreign key to User
- `totalPrice` - Total order amount
- `status` - PENDING | SHIPPED | DELIVERED | CANCELLED
- `orderDate` - Creation timestamp

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | - |
| `JWT_SECRET` | Secret key for JWT signing | ✅ | - |
| `JWT_EXPIRES_IN` | JWT expiration time | ❌ | 7d |
| `PORT` | Server port | ❌ | 3000 |
| `NODE_ENV` | Environment mode | ❌ | development |

### Validation Rules

#### Phone Number
- Must follow Iranian mobile format: `09xxxxxxxxx`
- Regex pattern: `^09\d{9}$`

#### Password
- Minimum 8 characters
- Required for all user accounts

## 📦 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards (JWT, Local, Roles)
│   └── strategies/      # Passport strategies
├── books/               # Book management module
├── cart/                # Shopping cart module
├── orders/              # Order management module
├── users/               # User management module
├── writers/             # Writer/Author module
├── database/            # Database service
├── common/              # Shared utilities
│   ├── exceptions/      # Global exception filters
│   └── logger/          # Custom logging
└── main.ts             # Application entry point
```

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Prisma team for the excellent ORM
- All contributors who helped improve this project

---

⭐ If you found this project helpful, please give it a star on GitHub!
