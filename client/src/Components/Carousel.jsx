import React from "react";

function Carousel() {
  return (
    <main>
      <section className="overview-section text-center py-5">
        <div className="container">
          <h2 className="fw-bold">Welcome to Your Financial Dashboard</h2>
          <p className="lead">
            This app helps you manage your finances with ease. From tracking
            your income and expenses to visualising trends, it provides powerful
            tools to keep you on top of your financial health. With intuitive
            charts and a customisable dashboard, you’ll have everything you need
            to make informed decisions and plan for the future. Let’s get
            started!
          </p>
        </div>
      </section>
      <hr className="featurette-divider" />

      <div id="myCarousel" className="m-6 p-3" data-bs-ride="carousel">
        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading fw-normal lh-1">
              Get a complete overview of your finances{" "}
              <span className="text-body-secondary">
                Welcome to the Dashboard.
              </span>
            </h2>
            <p className="lead">
              The Dashboard is the central hub for managing your finances. It
              provides a clear and interactive summary of your income, expenses,
              and overall financial health. With an easy-to-read layout, you can
              quickly review your financial data, track trends over time, and
              make informed decisions based on real-time insights. The dashboard
              is fully customizable to fit your personal needs.
            </p>
          </div>
          <div className="col-md-5">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="700"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
            >
              <title>Placeholder</title>
              <image
                href="dashboard-screenshot.png"
                width="100%"
                height="100%"
              />
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7 order-md-2">
            <h2 className="featurette-heading fw-normal lh-1">
              Visualise your finances with ease.{" "}
              <span className="text-body-secondary">
                Check out the Bar Chart feature.
              </span>
            </h2>
            <p className="lead">
              The Bar Chart feature allows you to track your income and expenses
              over time, giving you an intuitive overview of your financial
              status. With clear visualisation, you can see trends and make
              informed decisions about your finances. The chart dynamically
              updates based on your data, providing an interactive and
              easy-to-understand experience.
            </p>
          </div>
          <div className="col-md-5 order-md-1">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="700"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
            >
              <title>Placeholder</title>
              <image href="bar-chart.png" width="100%" height="100%" />
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className="row featurette">
          <div className="col-md-7">
            <h2 className="featurette-heading fw-normal lh-1">
              See your spending in a new way.{" "}
              <span className="text-body-secondary">
                Explore the Pie Chart feature.
              </span>
            </h2>
            <p className="lead">
              The Pie Chart feature gives you a visual representation of your
              financial categories. It breaks down your expenses and income into
              slices, making it easy to see where your money is going. The chart
              dynamically updates as you log new transactions, helping you
              quickly identify spending patterns and areas where you can adjust.
              It’s an excellent tool for budgeting and financial planning.
            </p>
          </div>
          <div className="col-md-5">
            <svg
              className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
              width="700"
              height="500"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Placeholder: 500x500"
              preserveAspectRatio="xMidYMid slice"
            >
              <title>Placeholder</title>
              <image href="pie-chart.png" width="100%" height="100%" />
            </svg>
          </div>
        </div>

        <hr className="featurette-divider" />
      </div>
    </main>
  );
}

export default Carousel;
