import React from 'react';

function Error ({ message }) {
  return (
    <div style={{ color: 'red', fontSize: '18px', fontWeight: 'bold' }}>
      {message}
    </div>
  );
};

export default Error;
