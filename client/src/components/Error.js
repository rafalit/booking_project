import React from 'react';

// Komponent funkcyjny Error
function Error({ message }) {
  return (
    // Zwraca div zawierający komunikat o błędzie
    <div style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>
      {message}
    </div>
  );
}

// Eksportuje komponent Error, aby mógł być używany w innych częściach aplikacji
export default Error;
