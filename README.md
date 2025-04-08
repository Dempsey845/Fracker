# 💸 Personal Finance Tracker

A full-stack finance dashboard that helps users manage and visualise their income and expenses with detailed analytics and chart visualisations. Built with React, Express, PostgreSQL, and Passport.js.

## ✨ Features

- 🔐 **Authentication**

  - Google OAuth and local email/password sign-in
  - Session handling with Passport.js

- 💰 **Financial Tracking**

  - Add incomes and expenses with date, category, and description
  - View total balances, monthly summaries, and daily breakdowns

- 📊 **Analytics Dashboard**

  - Interactive bar chart for daily/monthly totals
  - Pie chart visualisation of spending by category
  - Filter by month and year

- 🧾 **Transaction History**
  - View, search, and filter transactions
  - Categorised breakdown of incomes and expenses

## 🧱 Tech Stack

| Frontend     | Backend    | Database   | Auth                 | Charts   |
| ------------ | ---------- | ---------- | -------------------- | -------- |
| React        | Express.js | PostgreSQL | Passport.js          | Recharts |
| Tailwind CSS | Node.js    | Prisma/pg  | Google OAuth & Local |          |

## 📁 Project Structure

```
client/               # React frontend
  └── components/     # Reusable UI components (BarChart, PieChart, etc.)
  └── pages/          # Main views and dashboard
  └── utils/          # Helpers and formatters

/               # Express backend
  └── src/         # index.js server
```

## 📸 Screenshots

#### Dashboard View

![Dashboard](./docs/dashboard-screenshot.png)

#### Bar Chart Example

![Bar Chart](./docs/bar-chart.png)

#### Pie Chart Example

![Pie Chart](./docs/pie-chart.png)

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Dempsey845/Fracker.git
cd fracker
```

### 2. Set up the server

```bash
npm install
```

- Create a `.env` file with your DB URL, session secret, and Google OAuth credentials.

### 3. Set up the client

```bash
cd client
npm install
npm run build
npm start
```

### 4. Run the server

```bash
cd ..
node src/index.js
```

## 🛡️ Security & Auth

- User sessions stored securely with express-session
- Passwords hashed with bcrypt
- OAuth handled via Google strategy

## 📅 Upcoming Features

- Budget setting and goals
- Export to CSV

## 🤝 Contributing

Pull requests welcome! If you spot any bugs or have ideas for improvements, feel free to open an issue or PR.

## 📄 License

MIT License

---

**Made with ❤️ by Dempsey Newton**
