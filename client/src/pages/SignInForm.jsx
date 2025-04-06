import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      credentials: "include", // Sends cookies with the request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login successful", data);
      navigate("/dashboard"); // Navigate to the dashboard after successful login
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <a
                className="btn btn-block"
                href="http://localhost:5000/auth/google"
                role="button"
              >
                <i className="fab fa-google"></i> Sign In with Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
