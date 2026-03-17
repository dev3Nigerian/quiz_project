# quiz_project

## Quiz Management System

This project is being built week by week.

Week 1 set up the server, static files, database connection, and database tables.

Week 2 adds the authentication backend.

## Current Week 2 Features

- User registration
- User login
- Protected profile route with JWT
- Role middleware for future admin routes

## Project Setup

1. Go to the app folder.
2. Install packages.
3. Start the server.

```bash
cd quiz-app
npm install
node server.js
```

The server runs on `http://localhost:3000` by default.

## Environment File

The app uses these values in `quiz-app/.env`:

- `PORT`
- `DB_PATH`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Week 2 API Routes

### Register User

- Method: `POST`
- URL: `/api/auth/register`

Example body:

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"password": "password123"
}
```

### Login User

- Method: `POST`
- URL: `/api/auth/login`

Example body:

```json
{
	"email": "john@example.com",
	"password": "password123"
}
```

### Get Profile

- Method: `GET`
- URL: `/api/auth/profile`
- Header: `Authorization: Bearer your_token_here`

## What Was Tested

- Register a new user
- Login with the new user
- Open the protected profile route with a valid token
- Confirm profile returns `401` when no token is sent
