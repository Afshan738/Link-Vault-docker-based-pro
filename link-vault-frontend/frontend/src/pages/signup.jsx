import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


function RegisterPage() { 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      console.log('Registration successful:', data);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit}>
        <h1 className="title">Create Account</h1>
        <div>
          <label htmlFor='username'>Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Sign Up'}
        </button>
       {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Login</Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;