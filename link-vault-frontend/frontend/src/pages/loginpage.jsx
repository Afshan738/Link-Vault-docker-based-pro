import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (!username || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      const token = data.token;
      if (token) {
        localStorage.setItem('userToken', token);
        navigate('/dashboard');
      } else {
        throw new Error('Login successful, but no token was provided.');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit}>
        <h1 className="title">Login</h1>
        <div>
          <label htmlFor='username'>Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? "Logging In..." : 'Login'}
        </button>
       {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Sign Up</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;