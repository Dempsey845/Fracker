import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SignUpForm from "./pages/SignUpForm";
import SignInForm from "./pages/SignInForm";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./Components/Dashboard";
import SettingsPage from "./pages/SettingsPage";

import { FilterDataByYear, GetMonthTotals } from "./Handlers/ParseData";

function App() {
  const testData = [
    {
      id: 1,
      user_id: 6,
      amount: "200.00",
      note: null,
      date: "2025-04-05T23:00:00.000Z",
      created_at: "2025-04-06T18:13:31.574Z",
      category: "salary/wages",
    },
    {
      id: 2,
      user_id: 6,
      amount: "90.00",
      note: "Hello, world!",
      date: "2025-04-05T23:00:00.000Z",
      created_at: "2025-04-06T18:16:53.928Z",
      category: "businessincome",
    },
    {
      id: 3,
      user_id: 6,
      amount: "90.00",
      note: "Hello, world!",
      date: "2025-04-05T23:00:00.000Z",
      created_at: "2025-04-06T18:19:16.957Z",
      category: "freelancing/contracting",
    },
    {
      id: 4,
      user_id: 6,
      amount: "90.00",
      note: "Payment",
      date: "2025-03-05T00:00:00.000Z",
      created_at: "2025-04-07T10:32:41.941Z",
      category: "salary/wages",
    },
    {
      id: 5,
      user_id: 6,
      amount: "200.00",
      note: "Minecraft movie",
      date: "2025-02-15T00:00:00.000Z",
      created_at: "2025-04-07T10:36:56.243Z",
      category: "salary/wages",
    },
    {
      id: 6,
      user_id: 6,
      amount: "200.00",
      note: "Payment",
      date: "2024-03-07T00:00:00.000Z",
      created_at: "2025-04-07T11:25:46.840Z",
      category: "salary/wages",
    },
    {
      id: 7,
      user_id: 6,
      amount: "9.76",
      note: "Payment",
      date: "2024-03-07T00:00:00.000Z",
      created_at: "2025-04-07T15:42:06.380Z",
      category: "salary/wages",
    },
  ];

  const filteredData = FilterDataByYear(testData, 2025);
  const totals = GetMonthTotals(filteredData);

  console.log(filteredData, totals);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<SignInForm />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
