CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (full_name, email, password, role, status)
VALUES
  ('System Admin', 'admin@inventory.com', 'admin123', 'admin', 'active'),
  ('Sales Manager', 'manager@inventory.com', 'manager123', 'manager', 'active'),
  ('Store Staff', 'staff@inventory.com', 'staff123', 'staff', 'active')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  password = VALUES(password),
  role = VALUES(role),
  status = VALUES(status);
