import { useState } from 'react';

export default function PublicCapture() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'web' })
      });
      if (!res.ok) throw await res.json();
      setSubmitted(true);
    } catch (err) {
      setError(err.error || 'Something went wrong');
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 500, margin: '3rem auto', padding: '2rem', textAlign: 'center' }}>
        <h2>Thank You!</h2>
        <p>Your information has been submitted. We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '3rem auto', padding: '2rem' }}>
      <h2>Get in Touch</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Interested in DigitalHorses? Leave your details and we'll reach out.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name *" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input type="email" placeholder="Email *" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} style={inputStyle} />
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={4} style={{ display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
        <button type="submit" style={{ background: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>Submit</button>
      </form>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', marginBottom: '1rem', padding: '0.5rem' };
