# 🔧 Backend API Documentation

> RESTful API endpoints for the Massage Booking Application

## Base URL

```
Development: http://localhost:8000/api
Production:  https://api.massage-app.com/api
```

## Authentication

All protected endpoints require Bearer token authentication:

```http
Authorization: Bearer {your_access_token}
```

---

## Authentication Endpoints

### Register New User

```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "phone": "+989123456789"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+989123456789",
      "created_at": "2026-02-12T10:00:00Z"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "message": "User registered successfully"
}
```

---

### Login

```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The provided credentials are incorrect."
  }
}
```

---

### Get Current User

```http
GET /api/auth/me
```

**Headers**:
```http
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+989123456789",
    "email_verified_at": "2026-02-12T10:30:00Z",
    "created_at": "2026-02-12T10:00:00Z"
  }
}
```

---

### Logout

```http
POST /api/auth/logout
```

**Headers**:
```http
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

### Refresh Token

```http
POST /api/auth/refresh
```

**Request Body**:
```json
{
  "refresh_token": "def50200..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

---

## Appointment Endpoints

### List Appointments

```http
GET /api/appointments
```

**Query Parameters**:
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `date_from` (optional): Filter from date (YYYY-MM-DD)
- `date_to` (optional): Filter to date (YYYY-MM-DD)
- `user_id` (optional): Filter by user (admin only)
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default: 15)

**Example Request**:
```http
GET /api/appointments?status=confirmed&page=1&per_page=10
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "service": {
          "id": 1,
          "name": "دیپ تیشو ماساژ",
          "duration": 60,
          "price": 500000
        },
        "appointment_date": "2026-02-15T14:00:00Z",
        "status": "confirmed",
        "notes": "لطفا اتاق آرام باشد",
        "created_at": "2026-02-12T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "last_page": 3
    }
  }
}
```

---

### Create Appointment

```http
POST /api/appointments
```

**Request Body**:
```json
{
  "service_id": 1,
  "appointment_date": "2026-02-15T14:00:00Z",
  "notes": "لطفا اتاق آرام باشد"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "service_id": 1,
    "appointment_date": "2026-02-15T14:00:00Z",
    "status": "pending",
    "notes": "لطفا اتاق آرام باشد",
    "created_at": "2026-02-12T10:00:00Z"
  },
  "message": "Appointment created successfully"
}
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": {
      "service_id": ["The selected service is invalid."],
      "appointment_date": ["The appointment date must be a future date."]
    }
  }
}
```

---

### Get Appointment

```http
GET /api/appointments/{id}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+989123456789"
    },
    "service": {
      "id": 1,
      "name": "دیپ تیشو ماساژ",
      "description": "ماساژ عمقی برای رفع درد و تنش عضلانی",
      "duration": 60,
      "price": 500000
    },
    "appointment_date": "2026-02-15T14:00:00Z",
    "status": "confirmed",
    "notes": "لطفا اتاق آرام باشد",
    "created_at": "2026-02-12T10:00:00Z",
    "updated_at": "2026-02-12T11:00:00Z"
  }
}
```

---

### Update Appointment

```http
PUT /api/appointments/{id}
```

**Request Body**:
```json
{
  "appointment_date": "2026-02-15T16:00:00Z",
  "status": "confirmed",
  "notes": "زمان تغییر کرد"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointment_date": "2026-02-15T16:00:00Z",
    "status": "confirmed",
    "notes": "زمان تغییر کرد",
    "updated_at": "2026-02-12T12:00:00Z"
  },
  "message": "Appointment updated successfully"
}
```

---

### Delete Appointment

```http
DELETE /api/appointments/{id}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

## Service Endpoints

### List Services

```http
GET /api/services
```

**Query Parameters**:
- `is_active` (optional): Filter by active status (true/false)
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "دیپ تیشو ماساژ",
      "description": "ماساژ عمقی برای رفع درد و تنش عضلانی",
      "duration": 60,
      "price": 500000,
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "سنگ داغ ماساژ",
      "description": "استفاده از سنگ‌های گرم برای آرامش عمیق",
      "duration": 90,
      "price": 700000,
      "is_active": true,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

### Get Service Details

```http
GET /api/services/{id}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "دیپ تیشو ماساژ",
    "description": "ماساژ عمقی برای رفع درد و تنش عضلانی. این نوع ماساژ با فشار بیشتر روی لایه‌های عمیق عضلات انجام می‌شود.",
    "duration": 60,
    "price": 500000,
    "is_active": true,
    "features": [
      "کاهش درد عضلانی",
      "بهبود گردش خون",
      "افزایش انعطاف‌پذیری"
    ],
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

## Admin Endpoints

### Get Application Logs

```http
GET /api/logs/tail
```

**Query Parameters**:
- `lines` (optional): Number of lines to fetch (default: 200, max: 1000)

**Headers**:
```http
Authorization: Bearer {admin_access_token}
```

**Response** (200 OK):
```json
{
  "lines": [
    "[2026-02-12 10:00:00] local.INFO: User logged in",
    "[2026-02-12 10:05:00] local.INFO: Appointment created",
    "[2026-02-12 10:10:00] local.ERROR: Database connection failed"
  ],
  "lineCount": 3,
  "requestedLines": 200,
  "path": "storage/logs/laravel.log",
  "updatedAt": "2026-02-12T10:10:00Z"
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `INVALID_CREDENTIALS` | 401 | Login credentials are incorrect |
| `UNAUTHORIZED` | 401 | Authentication token missing or invalid |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `RESOURCE_CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

```
Auth endpoints: 5 requests per minute
General API: 60 requests per minute
Admin endpoints: 100 requests per minute
```

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1676196000
```

---

## Webhooks (Coming Soon)

Support for webhooks will be added to notify external systems of events:

- Appointment created
- Appointment confirmed
- Appointment cancelled
- Payment received

---

## Examples

### cURL Examples

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### Create Appointment
```bash
curl -X POST http://localhost:8000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "service_id": 1,
    "appointment_date": "2026-02-15T14:00:00Z",
    "notes": "Please use quiet room"
  }'
```

### JavaScript/TypeScript Example

```typescript
// Login
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('auth_token', data.data.access_token);
  return data.data.user;
};

// Fetch appointments
const getAppointments = async () => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch('http://localhost:8000/api/appointments', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  
  const data = await response.json();
  return data.data;
};
```

---

**API Version**: v1  
**Last Updated**: February 12, 2026
