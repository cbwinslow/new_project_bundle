# API Documentation Template 📡

> Template for documenting REST/GraphQL APIs

## Document Information

| Field | Value |
|-------|-------|
| **API Name** | [Your API Name] |
| **Version** | v1.0.0 |
| **Base URL** | `https://api.example.com/v1` |
| **Last Updated** | YYYY-MM-DD |
| **Author** | [Your Name] |

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
6. [Data Models](#data-models)
7. [Webhooks](#webhooks)
8. [SDKs & Examples](#sdks--examples)

---

## Overview

### Description

> [Brief description of what this API does and who it's for]

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.example.com/v1` |
| Staging | `https://api.staging.example.com/v1` |
| Development | `http://localhost:3000/v1` |

### API Standards

- RESTful design principles
- JSON request/response bodies
- UTF-8 encoding
- ISO 8601 date format (`YYYY-MM-DDTHH:mm:ssZ`)
- Pagination using cursor-based or offset pagination

---

## Authentication

### Authentication Methods

#### API Key

Include your API key in the request header:

```http
Authorization: Bearer YOUR_API_KEY
X-API-Key: YOUR_API_KEY
```

#### OAuth 2.0

```http
Authorization: Bearer ACCESS_TOKEN
```

**Token Endpoint:** `POST /oauth/token`

```bash
curl -X POST https://api.example.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## Rate Limiting

| Plan | Rate Limit | Burst |
|------|------------|-------|
| Free | 100 req/min | 10 req/sec |
| Pro | 1000 req/min | 50 req/sec |
| Enterprise | Custom | Custom |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limit Exceeded Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please retry after 60 seconds.",
    "retry_after": 60
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error context"
    },
    "request_id": "req_abc123"
  }
}
```

### HTTP Status Codes

| Code | Description | Use Case |
|------|-------------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request body/params |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_REQUEST` | Request body or parameters are invalid |
| `AUTHENTICATION_FAILED` | Authentication credentials are invalid |
| `PERMISSION_DENIED` | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

---

## Endpoints

### Users

#### List Users

```http
GET /users
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `per_page` | integer | No | Items per page (default: 20, max: 100) |
| `sort` | string | No | Sort field (e.g., `created_at`, `-name`) |
| `filter` | string | No | Filter expression |

**Response:**

```json
{
  "data": [
    {
      "id": "usr_abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

#### Get User

```http
GET /users/{id}
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | User ID |

**Response:**

```json
{
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

---

#### Create User

```http
POST /users
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "password": "securepassword123"
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "usr_xyz789",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

---

#### Update User

```http
PATCH /users/{id}
```

**Request Body:**

```json
{
  "name": "Jane Smith"
}
```

**Response:** `200 OK`

```json
{
  "data": {
    "id": "usr_xyz789",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "updated_at": "2024-01-21T14:00:00Z"
  }
}
```

---

#### Delete User

```http
DELETE /users/{id}
```

**Response:** `204 No Content`

---

### Endpoint Template

Use this template for documenting additional endpoints:

```markdown
#### [Action] [Resource]

\`\`\`http
[METHOD] /[endpoint]
\`\`\`

**Description:** [What this endpoint does]

**Authentication:** Required | Optional

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `param` | type | description |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param` | type | Yes/No | description |

**Request Body:**

\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response:**

\`\`\`json
{
  "data": {}
}
\`\`\`

**Errors:**

| Code | Description |
|------|-------------|
| 400 | Reason |
| 404 | Reason |
```

---

## Data Models

### User

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (prefix: `usr_`) |
| `email` | string | User's email address |
| `name` | string | User's display name |
| `avatar_url` | string | URL to user's avatar image |
| `created_at` | datetime | When the user was created |
| `updated_at` | datetime | When the user was last updated |

### [Add More Models]

| Field | Type | Description |
|-------|------|-------------|
| `field` | type | description |

---

## Webhooks

### Webhook Events

| Event | Description |
|-------|-------------|
| `user.created` | Fired when a new user is created |
| `user.updated` | Fired when a user is updated |
| `user.deleted` | Fired when a user is deleted |

### Webhook Payload

```json
{
  "id": "evt_abc123",
  "type": "user.created",
  "created_at": "2024-01-20T10:30:00Z",
  "data": {
    "user": {
      "id": "usr_xyz789",
      "email": "newuser@example.com"
    }
  }
}
```

### Webhook Signature

Verify webhooks using the signature header:

```
X-Webhook-Signature: sha256=abc123...
```

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## SDKs & Examples

### Official SDKs

- [JavaScript/Node.js](https://github.com/example/api-sdk-js)
- [Python](https://github.com/example/api-sdk-python)
- [Go](https://github.com/example/api-sdk-go)
- [Ruby](https://github.com/example/api-sdk-ruby)

### Code Examples

#### cURL

```bash
curl -X GET https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

#### JavaScript

```javascript
const response = await fetch('https://api.example.com/v1/users', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

#### Python

```python
import requests

response = requests.get(
    'https://api.example.com/v1/users',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
data = response.json()
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2024-01-01 | Initial release |
| v1.1.0 | 2024-02-01 | Added webhooks |

---

**Need Help?**

- 📧 Email: api-support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📚 Docs: [Full documentation](https://docs.example.com)
