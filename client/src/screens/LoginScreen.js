import React, { useState } from 'react';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";

const LoginScreen = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function Login(event) {
    event.preventDefault(); // Prevent the default form submission

    const user = {
      email,
      password
    };

    try {
      setLoading(true);

      const response = await axios.post('/api/users/login', user);
      const result = response.data; // Check the structure of the response

      setLoading(false);

      localStorage.setItem('currentUser', JSON.stringify(result));
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
            <input type="text" className="form-control" placeholder="email" 
              value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            <input type="password" className="form-control" placeholder="password"
              value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            <button className="btn btn-primary mt-3" onClick={Login}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
