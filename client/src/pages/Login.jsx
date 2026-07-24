import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <button type="submit" style={{ background: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>Login</button>
      </form>
      <p style={{ marginTop: '1rem' }}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
