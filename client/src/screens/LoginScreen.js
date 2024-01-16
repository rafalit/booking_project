import React, { useState } from 'react';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";

// Komponent LoginScreen
const LoginScreen = () => {
  // Stany do przechowywania danych o email, haśle, błędzie oraz stanie ładowania
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Funkcja obsługująca logowanie
  async function Login(event) {
    event.preventDefault(); // Zapobieganie domyślnemu przesłaniu formularza

    // Tworzenie obiektu użytkownika z danymi email i hasło
    const user = {
      email,
      password
    };

    try {
      setLoading(true);

      // Wysłanie zapytania POST do serwera w celu logowania
      const response = await axios.post('/api/users/login', user);
      const result = response.data; // Sprawdzenie struktury odpowiedzi

      setLoading(false);

      // Zapisanie informacji o zalogowanym użytkowniku w local storage
      localStorage.setItem('currentUser', JSON.stringify(result));
      // Przekierowanie użytkownika na stronę domową po udanym zalogowaniu
      window.location.href = '/home';
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Niepoprawny email lub hasło");
    }

    console.log(user);
  }

  return (
    <div>
      {loading && (<Loader/>)}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          {error && (<Error message={error}/>)}
          <div className='bs'>  
            <h2>Login</h2>
            {/* Inputy do wprowadzania danych email i hasła */}
            <input type="text" className="form-control" placeholder="email" 
              value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            <input type="password" className="form-control" placeholder="password"
              value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            {/* Przycisk do wywołania funkcji logowania */}
            <button className="btn btn-primary mt-3" onClick={Login}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Eksport komponentu LoginScreen do użycia w innych częściach aplikacji
export default LoginScreen;
