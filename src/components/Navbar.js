import React, { useState } from "react";
import "../styles/Navbar.css";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery); // Notify the parent component about the search query
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-gradient bg-dark">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            className="bi bi-activity me-2"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2"
            />
          </svg>
          AnimeLeveling
        </a>

        {/* Navbar Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links and Search Bar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active text-danger" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active text-danger" href="/about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active text-danger" href="/contact">
                Contact
              </a>
            </li>
          </ul>

          {/* Search Box */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
            />
            <button type="reset" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
