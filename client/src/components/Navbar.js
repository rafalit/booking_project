import React from 'react';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          RoomEase
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div className="navbar-nav">
            {/* Use a button element instead of a */}
            <button className="nav-item nav-link" onClick={() => { window.location.href = '/register'; }}>
              Rejestracja
            </button>
            {/* Use a button element instead of a */}
            <button className="nav-item nav-link" onClick={() => { window.location.href = '/login'; }}>
              Logowanie
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
