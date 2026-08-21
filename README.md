# Inventory Management System

## Backend setup with Next.js and MySQL

This project now includes a Next.js backend and MySQL integration for authentication and user management.

### 1. Create the MySQL database

Run this in MySQL:

```sql
CREATE DATABASE inventory_db;
USE inventory_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=inventory_db
```

### 3. Start the app

```bash
npm run dev
```

### 4. Test the backend

- Health check: http://localhost:3000/api/health
- Login: POST http://localhost:3000/api/auth/login
- Users: GET/POST http://localhost:3000/api/users
