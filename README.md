# 🏠 XE Web Developer Challenge

A full-stack real estate listing application built for the **XE Web Developer Challenge**.  
Implements a form for posting ads with validation and autocomplete functionality.

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone git@github.com:antoniskarv/xe-web-developer-challenge.git
cd xe-web-developer-challenge

# 2. Install all dependencies (root, frontend, backend)
npm install && cd frontend && npm install && cd ../backend && npm install && cd ..

# 3. Run both frontend + backend
npm run dev
```

> Frontend: http://localhost:5173 • Backend: http://localhost:8080

---

## 🚀 Overview

- **Backend (Node.js + Express)**
  - Proxy endpoint for area autocomplete
  - Mock endpoint for submitting listings
- **Frontend (React + Vite)**
  - Ad creation form with live validation
  - Autocomplete input field for area search
  - Basic success state after submission
- **Testing (Vitest + Testing Library)**
  - Unit tests and coverage for main components

---

## ✨ Bonus implemented

- **Autocomplete caching (backend):** In‑memory TTL cache (5 minutes) with a tiny LRU guard to reduce upstream calls.
- **Quick view of stored ads:** Success screen links to the raw list at **`GET /api/ads`** (JSON) so reviewers can verify persistence quickly.
- **Responsive tweaks:** Centered page layout, full‑width inputs, mobile‑friendly tap targets.
- **Tests:** Backend cache‑hit path covered; core frontend form & autocomplete covered with Vitest.

---

## ⚙️ Installation

Clone the repository and install dependencies for both frontend and backend:

```bash
git clone git@github.com:antoniskarv/xe-web-developer-challenge.git
cd xe-web-developer-challenge

# Install root dev dependencies
npm install

# Install frontend + backend dependencies
cd frontend && npm install
cd ../backend && npm install
cd ..
```

---

## ▶️ Running the Project

Start **both backend and frontend** together from the root:

```bash
npm run dev
```

Example output:

```
[SERVER] ✅ Server running on http://localhost:8080
[CLIENT]  VITE v5.2.0  ready in 400ms
```

### Available Commands

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Run **frontend + backend** concurrently |
| `npm run server`   | Run only the backend (Express)          |
| `npm run client`   | Run only the frontend (Vite)            |
| `npm run test`     | Run frontend unit tests                 |
| `npm run test:cov` | Run frontend tests with coverage report |

---

## 🌐 Backend API

### `GET /api/autocomplete?input=<text>`

Proxies requests to the external autocomplete service.

**Example**

```
GET http://localhost:8080/api/autocomplete?input=ath
```

**Response**

```json
[
  {
    "placeId": "ChIJZQKxYxB9oRQR_EqN8hU1C6Y",
    "mainText": "Athens",
    "secondaryText": "Greece"
  }
]
```

---

### `POST /api/ads`

Mock endpoint for ad submission.

**Request Body**

```json
{
  "title": "Modern Apartment in Kifisia",
  "type": "Rent",
  "area": { "placeId": "abc123", "mainText": "Kifisia" },
  "price": 1500,
  "description": "Newly renovated, 2 bedrooms"
}
```

**Response (201)**

```json
{
  "id": "1",
  "title": "Modern Apartment in Kifisia",
  "createdAt": "2025-10-06T18:12:34.000Z"
}
```

---

### `GET /api/ads`

Returns the **in‑memory** list of submitted ads (for quick verification / demo).

**Example**

```
GET http://localhost:8080/api/ads
```

**Response**

```json
[
  {
    "id": "1",
    "title": "Modern Apartment in Kifisia",
    "type": "Rent",
    "area": { "placeId": "abc123", "mainText": "Kifisia" },
    "price": 1500,
    "description": "Newly renovated, 2 bedrooms",
    "createdAt": "2025-10-06T18:12:34.000Z"
  }
]
```

---

## 💻 Frontend

Built with **React + Vite**.

### Features

- Ad creation form (`AdForm`)
- Fields:
  - Title (≤255 characters)
  - Type (dropdown)
  - Area (autocomplete component)
  - Price (numeric only)
  - Description (optional)
- Real-time and submit-time validation
- Success message after submission (plus link to `GET /api/ads`)

---

## 🧪 Testing

Frontend tests use:

- **Vitest** — fast test runner
- **React Testing Library** — component testing
- **@testing-library/user-event** — user interaction simulation

### Run tests

```bash
npm run test
```

### Run with coverage

```bash
npm run test:cov
```

Generates a coverage report in the terminal and an HTML report in  
`frontend/coverage/index.html`.

#### Coverage includes:

- Field validation (blur + submit)
- Disabled/enabled submit button logic
- Autocomplete input behavior (debounce + fetch)
- Backend cache hit path (Jest + Supertest)

---

## 🔧 Environment Setup

### Frontend `.env`

Create a file `frontend/.env` with:

```
VITE_API_BASE_URL=http://localhost:8080
```

You can also start from the template and adjust if needed:

```bash
cp frontend/.env.example frontend/.env
```

---

## 🧰 Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React, Vite, JSX              |
| Backend  | Node.js, Express, Axios       |
| Testing  | Vitest, React Testing Library |
| Tooling  | Concurrently, CORS, dotenv    |

---

## 👨‍💻 Author

**A. Karvouniaris**  
📧 [antonisrafkarv@gmail.com]  
🌐 [https://github.com/antoniskarv](https://github.com/antoniskarv)
