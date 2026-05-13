# NativeTalk Test Accounts Guide

## Overview
This document provides a complete guide to the test accounts created for the NativeTalk language tutoring application. These accounts are ready for frontend development, integration testing, and end-to-end testing.

## Account Credentials

**Shared Password for ALL accounts:** `Password123`

### Student Accounts (5)

| Email | Level | Language | Status |
|-------|-------|----------|--------|
| alice@example.com | A1 | French | Active ✓ |
| bob@example.com | B1 | Spanish | Active ✓ |
| carlos@example.com | A2 | German | Active ✓ |
| diana@example.com | B2 | Japanese | Active ✓ |
| emma@example.com | A1 | Italian | Active ✓ |

### Tutor Accounts (5)

| Email | Language | Specialization | Status |
|-------|----------|-----------------|--------|
| marie@example.com | English (Anglisht) | Native speaker | Active ✓ |
| hans@example.com | German (Gjermanisht) | Certified tutor | Active ✓ |
| juan@example.com | Spanish (Spanjisht) | Experienced | Active ✓ |
| yuki@example.com | Korean (Koreane) | Native speaker | Active ✓ |
| sophia@example.com | French (Frengjisht) | Certified | Active ✓ |

## Authentication Endpoints

### Login
```
POST http://127.0.0.1:8000/api/v1/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "alice@example.com",
    "full_name": "Alice Johnson",
    "role": "student",
    "is_active": true,
    "timezone": "UTC"
  }
}
```

### Register (New Account Creation)
```
POST http://127.0.0.1:8000/api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SomePassword123",
  "full_name": "New User"
}
```

## Database Information

- **Host:** aws-0-eu-west-1.pooler.supabase.com
- **Port:** 5432
- **Database:** Uses PostgreSQL via Supabase

### Tables Referenced
- `users` - User account information
- `student` - Student-specific data (language level, etc.)
- `teacher` - Teacher-specific data (language, certifications, etc.)
- `refresh_tokens` - JWT refresh token management

## Testing Scenarios

### 1. Student Login & Profile
Use any student account to test:
- Login flow
- Student dashboard
- Profile viewing/editing
- Language level display

**Test with:** alice@example.com, bob@example.com

### 2. Tutor Login & Profile
Use any tutor account to test:
- Tutor login and authentication
- Tutor dashboard
- Availability settings
- Tutor search/discovery

**Test with:** marie@example.com, hans@example.com

### 3. Lesson Booking
- Student searches for tutors (5 different languages available)
- Student books a lesson with a tutor
- Tutor accepts/declines lesson request

**Test Combo:** alice@example.com (student) → marie@example.com (tutor)

### 4. Multi-Language Testing
Each tutor teaches a different language, perfect for testing:
- Language filtering
- Locale-specific content
- Multi-language UI

Available languages:
- English (Anglisht)
- German (Gjermanisht)
- Spanish (Spanjisht)
- French (Frengjisht)
- Korean (Koreane)

## Backend Configuration

**FastAPI Server:**
- URL: http://127.0.0.1:8000
- Status endpoint: GET /api/v1/health
- Auto-reload enabled for development

**Password Requirements:**
- Minimum 8 characters
- Hashed with bcrypt (automatic salt generation)
- All test accounts use: `Password123`

**JWT Token Configuration:**
- Access tokens: 15-minute expiration
- Refresh tokens: 30-day expiration
- Algorithm: HS256

## Account Setup Details

**Database State:**
- All 10 accounts are ACTIVE
- All accounts have `is_suspended = false`
- All accounts have `timezone = UTC`
- All password hashes are bcrypt format
- All RefreshToken records properly stored

**Verification Status:**
- ✓ Login endpoint: 200 OK for all 10 accounts
- ✓ Registration endpoint: 201 Created
- ✓ JWT token generation: Working
- ✓ Password hashing: bcrypt verified
- ✓ Database connectivity: Confirmed

## Frontend Development Tips

1. **Use these accounts for manual testing** - No need to create fake data
2. **Test all 5 student levels** - A1 through B2 representation
3. **Test tutor matching** - Students searching for tutors by language
4. **Test authentication flows** - Login, logout, token refresh
5. **Test user roles** - Role-based UI differences between students/tutors

## Troubleshooting

### Login Returns 500 Error
- Check backend is running: `http://127.0.0.1:8000/api/v1/health`
- Verify email spelling matches exactly
- Confirm password is exactly: `Password123`
- Check database connection in .env

### Password Too Short Error
- Use exactly: `Password123` (11 characters)
- Other test passwords must be 8+ characters

### Token Issues
- Refresh tokens stored in `refresh_tokens` table
- Access token lifetime: 15 minutes
- Refresh token lifetime: 30 days

## Quick Start

1. Run backend:
   ```bash
   cd Backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. Test login:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"Password123"}'
   ```

3. Use returned tokens for authenticated requests:
   ```bash
   curl -H "Authorization: Bearer <access_token>" \
     http://127.0.0.1:8000/api/v1/users/me
   ```

## Account Consistency

All accounts share the same password (`Password123`) for testing convenience. Each account:
- Has unique email
- Has proper role assignment (student or teacher)
- Is linked to appropriate language/level data
- Has proper timezone (UTC) and active status
- Can generate and refresh JWT tokens

---

**Last Updated:** [Current Session]
**Status:** Ready for Testing ✓
