import React, { useEffect, useState } from "react";

function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details from the  API route (/api/dashboard)
    fetch("http://localhost:5000/api/dashboard", {
      credentials: "include", // Include cookies for session-based auth
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Authenticated") {
          setIsAuthenticated(true);
          setUser(data.user); // Set the user data from the response
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  if (!isAuthenticated) {
    return (
      <div>
        <h1>You are not logged in.</h1>
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user && (
        <div>
          <h3>User Details:</h3>
          <p>Email: {user.email}</p>
          {/* Display other user details here */}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
