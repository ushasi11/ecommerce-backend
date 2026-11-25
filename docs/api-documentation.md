# E-commerce Backend API Documentation

**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json`  
**Authentication:** Bearer Token (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints

### Register User
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}