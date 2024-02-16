import { Link } from 'react-router-dom';
import React from 'react';
import backgroundImage from "./background.jpg"; // Replace with the actual path

const Loadingscreen = () => {
  const containerStyle = {
    background: `url(${backgroundImage}) center/cover no-repeat`,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  };

  const titleStyle = {
    color: 'white',
    textShadow: '2px 2px 4px black',
    fontSize: '10rem',
    marginBottom: '10px',
  };

  const subTitleStyle = {
    color: 'white',
    textShadow: '0.5px 2px 4px black',
    fontSize: '2rem',
    marginBottom: '20px',
  };

  const buttonStyle = {
    color: 'black',
    backgroundColor: 'white',
    padding: '10px 20px',
    fontSize: '2rem',
    textDecoration: 'none',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>MilusiPokoik</h2>
      <h1 style={subTitleStyle}>Znajdziesz tu hotel z każdego miejsca w Polsce</h1>
      <Link to="/home" style={buttonStyle}>
        Rozpocznij!
      </Link>
    </div>
  );
};

export default Loadingscreen;
