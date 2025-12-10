# JWT Auth Full‑Stack Example (React + Node.js + PostgreSQL + Docker)

This project is a simple full‑stack authentication setup running in Docker on WSL:

- **Frontend**: React (Signup, Login, Welcome pages)
- **Backend**: Node.js + Express + JWT authentication
- **Database**: PostgreSQL (users table with hashed passwords)
- **Orchestration**: Docker Compose

---

## 1. Architecture

### Backend (Node.js + Express)

- Location: `./backend`
- Exposed port: `4000`
- Responsibilities:
  - Provide REST API endpoints:
    - `GET /` – health check
    - `POST /auth/signup` – create user
    - `POST /auth/login` – authenticate user, return JWT
    - `GET /welcome` – protected route, requires `Authorization: Bearer <token>`
  - Connect to PostgreSQL using the `pg` library.
  - Hash passwords with `bcryptjs`.
  - Issue and verify JWTs with `jsonwebtoken`.

### Frontend (React)

- Location: `./frontend`
- Exposed port: `3000`
- Responsibilities:
  - Render:
    - Signup form (create user)
    - Login form (obtain JWT)
    - Welcome page (protected, uses JWT)
  - Store JWT in `localStorage`.
  - Call backend via Axios with `Authorization: Bearer <token>` header.

### Database (PostgreSQL)

- Location: Docker container from `postgres:16` image.
- Service name: `db`
- Exposed port: `5432`
- Database:
  - Name: `authdb`
  - User: `authuser`
  - Password: `authpass`
- Table:
  - `users(id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255))`

---

## 2. Prerequisites

- Windows with **WSL2** and a Linux distro (e.g. Ubuntu).
- Docker / Docker Desktop configured to work with WSL.
- Basic tools: `git`, `curl`.

---

## 3. Project Setup

### 3.1 Generate project structure (optional)

- Clone this project
- docker compose up -d

- Backend will run on `http://localhost:4000`
- Frontend will run on `http://localhost:3000`
- PostgreSQL will run on `localhost:5432` (inside Docker network as `db:5432`)

To stop:
	- ` docker compose down`


---

## 4. Testing the Backend API

You can test using `curl`, Postman, or any REST client.

### 4.1 Health check

- `curl http://localhost:4000/`

Expected: small JSON indicating the backend is running. [web:88]

### 4.2 Signup (create user)

`curl -X POST http://localhost:4000/auth/signup
-H "Content-Type: application/json"
-d '{"email":"test@example.com","password":"secret123"}'`


Expected: JSON like `{"message":"User created"}` or an error if the email already exists. [web:88]

### 4.3 Login (get JWT)

`curl -X POST http://localhost:4000/auth/login
-H "Content-Type: application/json"
-d '{"email":"test@example.com","password":"secret123"}'`


Expected: JSON containing `token`, for example:

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


Copy the token value for the next step. [web:79]

### 4.4 Access protected route `/welcome`

curl http://localhost:4000/welcome
-H "Authorization: Bearer <TOKEN_FROM_LOGIN>"


Expected: JSON message like `{"message":"Welcome, test@example.com"}`. [web:79]

---

## 5. Using the Frontend

Open in browser:

- `http://localhost:3000`

Flow:

1. Go to **Signup** page:
   - Enter `email` and `password` (minimum 6 chars).
   - Submit → user is created in DB via backend `/auth/signup`.

2. Go to **Login** page:
   - Enter the same credentials.
   - On success, backend returns a JWT.
   - Frontend stores the token in `localStorage` and redirects to **Welcome**.

3. Go to **Welcome** page:
   - React sends `GET /welcome` with `Authorization: Bearer <token>`.
   - If the token is valid, welcome message is shown.
   - Logout button clears the token and redirects back to login.

---

## 6. Inspecting Data in PostgreSQL

To verify stored users:

### 6.1 Open psql inside the db container

From project root:

`docker compose exec db psql -U authuser -d authdb`


This opens the `psql` shell inside the container. [web:99][web:102]

### 6.2 List tables

In `psql`:


You should see a `users` table.

### 6.3 View all users

SELECT * FROM users;

Columns:

- `id` – numeric ID
- `email` – user email you signed up with
- `password` – hashed password (not plaintext)

---

## 7. Common Troubleshooting Tips

- **Backend not reachable**
  - Check container status: `docker compose ps`
  - Look at backend logs: `docker compose logs -f backend` [web:83]

- **Frontend blank page**
  - Open DevTools → Console; ensure no runtime errors from your JS files.
  - Check `frontend/src/api.js` does not use `process.env` directly in the browser.
  - Ensure `<div id="root"></div>` exists in `frontend/public/index.html` and `index.js` mounts React on it. 

- **Cannot see users in DB**
  - Ensure signup completed successfully (no error response).
  - Re‑run `docker compose exec db psql -U authuser -d authdb` and `SELECT * FROM users;`.

---

This project is intended as a minimal, educational setup showing how to connect a React frontend, Node.js backend, and PostgreSQL database using Docker Compose, with JWT‑based authentication. 


