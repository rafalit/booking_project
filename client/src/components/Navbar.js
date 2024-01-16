import React from 'react';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

function logout(){
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
}

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          MilusiPokoik.pl
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
          <div className="navbar-nav mr-5">
            {user ? (
              <>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {user.username}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="/bookings">Zamówienia</a>
                    <a class="dropdown-item" href="#" onClick={logout}>Wyloguj</a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button className="nav-item nav-link" onClick={() => { window.location.href = '/register'; }}>
                  Rejestracja
                </button>
                <button className="nav-item nav-link" onClick={() => { window.location.href = '/login'; }}>
                  Logowanie
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
