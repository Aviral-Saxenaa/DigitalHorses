import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <button type="submit" style={{ background: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ marginTop: '1rem' }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
