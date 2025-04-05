import React from "react";

function Header() {
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
            <a href="#" class="nav-link px-2 text-dark ">
              Home
            </a>
          </li>
          <li>
            <a href="#" class="nav-link px-2 text-dark">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" class="nav-link px-2 text-dark">
              Contact
            </a>
          </li>
        </ul>

        <div class="col-md-3 text-end">
          <button type="button" class="btn btn-outline-dark me-2">
            Login
          </button>
          <button type="button" class="btn btn-dark">
            Sign-up
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header;
