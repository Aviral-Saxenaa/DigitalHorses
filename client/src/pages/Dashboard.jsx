import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leads } from '../services/api';

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

export default function Dashboard() {
  const [data, setData] = useState({ leads: [], total: 0, page: 1, limit: 10 });
  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    leads.list(params).then(setData).catch(console.error);
  }, [filters]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Leads Dashboard</h2>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })} style={{ padding: '0.4rem' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Search name, email, company..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })} style={{ padding: '0.4rem', flex: 1 }} />
        <Link to="/" style={{ background: '#e94560', color: '#fff', padding: '0.4rem 1rem', textDecoration: 'none' }}>New Lead</Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: '#fff' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Company</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Assigned To</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.leads.map(lead => (
            <tr key={lead.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}><Link to={`/leads/${lead.id}`}>{lead.name}</Link></td>
              <td style={tdStyle}>{lead.email}</td>
              <td style={tdStyle}>{lead.company || '-'}</td>
              <td style={tdStyle}><span style={statusBadge(lead.status)}>{lead.status}</span></td>
              <td style={tdStyle}>{lead.assigned_name || '-'}</td>
              <td style={tdStyle}>{new Date(lead.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        {data.page > 1 && <button onClick={() => setFilters({ ...filters, page: data.page - 1 })} style={btnStyle}>Prev</button>}
        <span style={{ padding: '0.4rem' }}>Page {data.page}</span>
        {data.page * data.limit < data.total && <button onClick={() => setFilters({ ...filters, page: data.page + 1 })} style={btnStyle}>Next</button>}
      </div>
    </div>
  );
}

const thStyle = { padding: '0.6rem', textAlign: 'left' };
const tdStyle = { padding: '0.6rem' };
const btnStyle = { padding: '0.4rem 1rem', cursor: 'pointer' };
const statusBadge = (status) => ({
  background: status === 'won' ? '#4caf50' : status === 'lost' ? '#f44336' : '#ff9800',
  color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem'
});
