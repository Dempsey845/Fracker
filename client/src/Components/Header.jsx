import React, { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to indicate loading
  const [isLoading, setIsLoading] = useState(true); // Loading state to handle UI while fetching auth status

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/check-auth", {
          credentials: "include", // Include cookies for session-based auth
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error fetching authentication status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Set loading to false once the check completes
      }
    };

    checkAuth(); // Check auth on mount
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    const response = await fetch("http://localhost:5000/logout", {
      credentials: "include", // Include cookies for session-based auth
    });

    if (response.ok) {
      console.log("Logged out successfully!");
      setIsAuthenticated(false); // Update state after logout
    } else {
      console.error("Logout failed!");
    }
  };

  function showLoginAndSignup() {
    return (
      <div>
        <button
          onClick={handleLogin}
          type="button"
          className="btn btn-outline-dark me-2"
        >
          Login
        </button>
        <button onClick={handleSignup} type="button" className="btn btn-dark">
          Sign-up
        </button>
      </div>
    );
  }

  function showLogout() {
    return (
      <div>
        <button onClick={handleLogout} type="button" className="btn btn-dark">
          Logout
        </button>
      </div>
    );
  }

  // While loading authentication status, show a loading spinner or something similar
  if (isLoading) {
    return (
      <div className="container">
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div className="col-md-3 mb-2 mb-md-0">
            <a
              href="/"
              className="d-inline-flex link-body-emphasis text-decoration-none"
            >
              <svg
                className="bi"
                width="40"
                height="32"
                role="img"
                aria-label="Bootstrap"
              >
                <use href="#bootstrap"></use>
              </svg>
            </a>
          </div>
          <div className="col-md-3 text-end">
            <p>Loading...</p> {/* Display loading message or spinner */}
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div className="col-md-3 mb-2 mb-md-0">
          <a
            href="/"
            className="d-inline-flex link-body-emphasis text-decoration-none"
          >
            <svg
              className="bi"
              width="40"
              height="32"
              role="img"
              aria-label="Bootstrap"
            >
              <use href="#bootstrap"></use>
            </svg>
          </a>
        </div>

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <a href="/" className="nav-link px-2 text-dark">
              Home
            </a>
          </li>
          <li>
            <a
              href="http://localhost:5000/dashboard"
              className="nav-link px-2 text-dark"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-dark">
              Contact
            </a>
          </li>
          <li>
            <a
              href="http://localhost:3000/settings"
              className="nav-link px-2 text-dark"
            >
              <SettingsIcon />
            </a>
          </li>
        </ul>

        <div className="col-md-3 text-end">
          {isAuthenticated ? showLogout() : showLoginAndSignup()}
        </div>
      </header>
    </div>
  );
}

export default Header;
