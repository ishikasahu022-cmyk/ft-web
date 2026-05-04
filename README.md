# 💰 Finance Tracker App (ft-web)

A modern personal finance management web application built with React.  
It helps users track income, expenses, budgets, reports, and financial goals in one place.

---

## 🚀 Features

- 📊 Dashboard with financial overview
- 💰 Income & Expense tracking (CRUD)
- 🏷️ Category management
- 📅 Budget planning & monitoring
- 📈 Financial reports & analytics
- ⏰ Payment reminders
- 👤 User profile management

---

## 🧱 Tech Stack

- React (Frontend)
- Context API / Redux (State Management)
- REST API integration
- CSS / Tailwind (UI styling optional)
- Chart libraries for analytics

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api

📁 Folder Structure
ft-web/
│
├── public/
│   └── index.html
│
├── src/
│   ├── api/              # API service calls
│   ├── auth/             # Authentication logic
│   ├── pages/            # App pages (Dashboard, Transactions, etc.)
│   ├── utils/            # Helper functions
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

🛠️ Installation & Setup
# Clone repository
git clone https://github.com/your-repo/ft-web.git

# Move into project
cd ft-web

# Install dependencies
npm install

# Start development server
npm start