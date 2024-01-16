import React from 'react';

// Komponent funkcyjny Success
function Success({ message }) {
  return (
    // Zwraca div z komunikatem o sukcesie
    <div style={{ color: 'green', fontSize: '18px', fontWeight: 'bold' }}>
      {message}
    </div>
  );
}

// Eksportuje komponent Success do użycia w innych częściach aplikacji
export default Success;
