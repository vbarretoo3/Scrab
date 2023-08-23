import React, { useState } from 'react';
import { useAuth } from '../context/auth'; // Assuming AuthContext is in the same directory
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { logIn } = useAuth();
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await logIn(email, password);
        navigate('/schedule');
    } catch {
      setError('Failed to log in.');
    }

    setLoading(false);
  }

  return (
    <>
        <Header/>
        <div>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
            <label>Email:
            <input type="email" onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>Password:
            <input type="password" onChange={e => setPassword(e.target.value)} required />
            </label>
            <button className='button-pill' disabled={loading} type="submit">Log In</button>
        </form>
        </div>
    </>
  );
}

export default Login;
