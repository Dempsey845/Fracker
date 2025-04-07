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
import { filterDataByYear } from "./Handlers/ParseData";

function App() {
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
