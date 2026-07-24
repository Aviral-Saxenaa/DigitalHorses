import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leads } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    leads.get(id).then(l => { setLead(l); setStatus(l.status); }).catch(() => navigate('/dashboard'));
    leads.activities(id).then(setActivities).catch(console.error);
  }, [id]);

  const handleUpdate = async (data) => {
    await leads.update(id, data);
    const updated = await leads.get(id);
    setLead(updated);
    setStatus(updated.status);
    const acts = await leads.activities(id);
    setActivities(acts);
  };

  if (!lead) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem', cursor: 'pointer' }}>← Back</button>
      <h2>{lead.name}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div><strong>Email:</strong> {lead.email}</div>
        <div><strong>Phone:</strong> {lead.phone || '-'}</div>
        <div><strong>Company:</strong> {lead.company || '-'}</div>
        <div><strong>Source:</strong> {lead.source}</div>
        <div><strong>Assigned To:</strong> {lead.assigned_name || 'Unassigned'}</div>
        <div><strong>Created:</strong> {new Date(lead.created_at).toLocaleString()}</div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong>
        <select value={status} onChange={e => handleUpdate({ status: e.target.value })} style={{ marginLeft: '0.5rem', padding: '0.3rem' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Notes:</strong>
        <p style={{ background: '#f5f5f5', padding: '0.5rem', minHeight: '2rem' }}>{lead.notes || 'No notes'}</p>
      </div>
      {user && (
        <div style={{ marginBottom: '2rem' }}>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={3} style={{ width: '100%', padding: '0.5rem' }} />
          <button onClick={() => { if (note) { handleUpdate({ notes: note }); setNote(''); } }} style={{ background: '#e94560', color: '#fff', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', marginTop: '0.5rem' }}>Add Note</button>
        </div>
      )}
      <h3>Activity Trail</h3>
      <div style={{ borderTop: '1px solid #ddd' }}>
        {activities.map(a => (
          <div key={a.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
            <strong>{a.action}</strong> by {a.user_name || 'System'} - {new Date(a.created_at).toLocaleString()}
            {a.detail && <p style={{ margin: '0.2rem 0 0 1rem', color: '#666' }}>{a.detail}</p>}
          </div>
        ))}
        {activities.length === 0 && <p style={{ color: '#999' }}>No activity yet</p>}
      </div>
    </div>
  );
}
