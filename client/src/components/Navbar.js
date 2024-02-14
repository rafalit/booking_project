import React from 'react';

// Komponent Navbar
function Navbar() {
  // Pobranie informacji o użytkowniku z lokalnego magazynu
  const user = JSON.parse(localStorage.getItem('currentUser'));

  // Funkcja obsługująca wylogowanie użytkownika
  function logout() {
    localStorage.removeItem('currentUser');  // Usunięcie danych użytkownika z lokalnego magazynu
    window.location.href = '/login';  // Przekierowanie użytkownika na stronę logowania
  }

  return (
    // Struktura paska nawigacyjnego
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
            {/* Warunek sprawdzający, czy użytkownik jest zalogowany */}
            {user ? (
              <>
                {/* Dropdown menu dla zalogowanego użytkownika */}
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {user.username}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="/profile">
                      Profil
                    </a>
                    <a className="dropdown-item" href="#" onClick={logout}>
                      Wyloguj
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Przyciski dla niezalogowanego użytkownika */}
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

// Eksportuje komponent Navbar do użycia w innych częściach aplikacji
export default Navbar;
