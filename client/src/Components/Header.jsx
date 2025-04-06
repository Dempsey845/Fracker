import React, { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch user details from the  API route (/api/dashboard)
    fetch("http://localhost:5000/api/dashboard", {
      credentials: "include", // Include cookies for session-based auth
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Authenticated") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  function showLoginAndSignup() {
    return (
      <div>
        <button
          onClick={() => navigate("/login")}
          type="button"
          class="btn btn-outline-dark me-2"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          type="button"
          class="btn btn-dark"
        >
          Sign-up
        </button>
      </div>
    );
  }

  return (
    <div class="container">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div class="col-md-3 mb-2 mb-md-0">
          <a
            href="/"
            class="d-inline-flex link-body-emphasis text-decoration-none"
          >
            <svg
              class="bi"
              width="40"
              height="32"
              role="img"
              aria-label="Bootstrap"
            >
              <use href="#bootstrap"></use>
            </svg>
          </a>
        </div>

        <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <a href="/" class="nav-link px-2 text-dark ">
              Home
            </a>
          </li>
          <li>
            <a
              href="http://localhost:5000/dashboard"
              class="nav-link px-2 text-dark"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" class="nav-link px-2 text-dark">
              Contact
            </a>
          </li>
          <li>
            <a href="#" class="nav-link px-2 text-dark">
              <SettingsIcon />
            </a>
          </li>
        </ul>

        <div class="col-md-3 text-end">
          {isAuthenticated ? null : showLoginAndSignup()}
        </div>
      </header>
    </div>
  );
}

export default Header;
