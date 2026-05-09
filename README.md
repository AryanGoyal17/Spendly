# 💸 Spendly

> A full-stack personal expense tracking web app — log expenses, visualize spending, and stay within budget.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node%20%2B%20Express-68a063?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

> 🚧 **Work in Progress** — actively being built.

---

## 📖 About

**Spendly** is a full-stack expense tracker where users can log daily expenses by category, filter and search through their history, visualize spending patterns through interactive charts, and set a monthly budget with overspend alerts.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup and login with hashed passwords
- ➕ **Add / Edit / Delete Expenses** — Full CRUD for expense management
- 🗂️ **Category Tagging** — Food, Transport, Shopping, Health, Education, Entertainment, Other
- 🔍 **Filter & Search** — Filter expenses by category and date range
- 📊 **Pie Chart** — Visual breakdown of spending by category
- 📈 **Bar Chart** — Monthly spending trend over the last 6 months
- 💰 **Budget Alerts** — Color-coded progress bar (green → yellow → red)
- 📋 **Summary Cards** — Total spent, transactions count, top category, average daily spend
- 📱 **Responsive Design** — Works on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React (Vite) | UI framework |
| Tailwind CSS | Styling |
| Recharts | Pie and bar charts |
| Axios | API calls to backend |
| React Router DOM | Client-side routing |
| react-hot-toast | Toast notifications |

### Backend
| Tech | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| Mongoose | MongoDB ODM |
| jsonwebtoken | JWT auth tokens |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Database & Deployment
| Tech | Purpose |
|---|---|
| MongoDB Atlas | Cloud NoSQL database |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 📁 Folder Structure

```
spendly/
│
├── spendly-frontend/
│   ├── src/
│   │   ├── api/                # Axios instance + API call functions
│   │   ├── components/         # Reusable UI components (Navbar, Charts, Cards)
│   │   ├── context/            # AuthContext + useAuth hook
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   └── Settings.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── spendly-backend/
    ├── controllers/
    │   ├── authController.js
    │   ├── expenseController.js
    │   └── userController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Expense.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── expenseRoutes.js
    │   └── userRoutes.js
    ├── .env
    ├── server.js
    └── package.json
```

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Expenses — `/api/expenses` *(JWT protected)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all expenses (supports `?category=&startDate=&endDate=`) |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/:id` | Edit an existing expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

### User — `/api/user` *(JWT protected)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/me` | Get logged-in user profile + budget |
| PUT | `/api/user/budget` | Update monthly budget |

---

## 🗃️ Database Schema

### User
```js
{
  name: String,
  email: String,         // unique
  password: String,      // bcrypt hashed
  monthlyBudget: Number, // default: 0, updated from Settings page
  createdAt: Date
}
```

### Expense
```js
{
  userId: ObjectId,   // ref to User
  amount: Number,
  category: String,   // enum: Food | Transport | Shopping | Entertainment | Health | Education | Other
  note: String,
  date: Date,
  createdAt: Date
}
```

---

## 👤 Author

**Aryan Goyal**
- GitHub: [AryanGoyal17](https://github.com/AryanGoyal17)
- LinkedIn: [Aryan Goyal](https://www.linkedin.com/in/aryan-goyal-814b44378/)
