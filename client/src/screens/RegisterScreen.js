import axios from 'axios';
import React, { useState } from 'react';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from '../components/Success';
import { set } from 'mongoose';

// Komponent RegisterScreen
const RegisterScreen = () => {
  // Stany do przechowywania danych o nazwie użytkownika, emailu, haśle, potwierdzeniu hasła, błędzie, stanie ładowania oraz sukcesie
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState();

  // Funkcja rejestracji
  async function register() {
    // Sprawdzenie, czy wprowadzone hasło zgadza się z potwierdzeniem hasła
    if (password === confirmPassword) {
      const user = {
        username,
        email,
        password,
        confirmPassword
      };

      try {
        setLoading(true);
        // Wysłanie zapytania POST do serwera w celu rejestracji użytkownika
        const result = await axios.post('/api/users/register', user).data;
        setLoading(false);
        setSuccess(true);

        // Wyczyszczenie stanów po pomyślnej rejestracji
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    } else {
      // Alert w przypadku, gdy hasła nie zgadzają się
      alert('Passwords do not match');
    }
  }

  return (
    <div>
      {loading && (<Loader/>)}
      {error && (<Error/>)}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          {success && (<Success message="Rejestracja pomyślna"/>)}
          <div className="bs">
            <h2>Registration</h2>
            {/* Inputy do wprowadzenia danych username, email, hasła oraz potwierdzenia hasła */}
            <input
              type="text"
              className="form-control"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Przycisk do wywołania funkcji rejestracji */}
            <button className="btn btn-primary mt-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Eksport komponentu RegisterScreen do użycia w innych częściach aplikacji
export default RegisterScreen;
