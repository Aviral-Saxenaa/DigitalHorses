const request = require('supertest');
const app = require('../index');
const db = require('../config/db');

afterAll(() => db.close());

describe('Lead Routes', () => {
  let adminToken, memberToken, leadId;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ name: 'Admin', email: 'admin@test.com', password: 'pass123', role: 'admin' });
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
    adminToken = adminRes.body.token;

    await request(app).post('/api/auth/register').send({ name: 'Member', email: 'member@test.com', password: 'pass123' });
    const memberRes = await request(app).post('/api/auth/login').send({ email: 'member@test.com', password: 'pass123' });
    memberToken = memberRes.body.token;
  });

  it('should create a lead (authenticated)', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'John Doe', email: 'john@test.com', company: 'ACME' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
    leadId = res.body.id;
  });

  it('should allow public lead creation without auth', async () => {
    const res = await request(app).post('/api/leads').send({ name: 'Public User', email: 'public@test.com' });
    expect(res.status).toBe(201);
  });

  it('should list leads with pagination', async () => {
    const res = await request(app).get('/api/leads').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('leads');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('limit');
  });

  it('should filter leads by status', async () => {
    const res = await request(app).get('/api/leads?status=new').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leads)).toBe(true);
  });

  it('should get a single lead', async () => {
    const res = await request(app).get(`/api/leads/${leadId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(leadId);
  });

  it('should update a lead', async () => {
    const res = await request(app)
      .put(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'contacted' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('contacted');
  });

  it('should return activities for a lead', async () => {
    const res = await request(app).get(`/api/leads/${leadId}/activities`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should enforce member access to own leads only', async () => {
    const res = await request(app).get(`/api/leads/${leadId}`).set('Authorization', `Bearer ${memberToken}`);
    expect(res.status).toBe(403);
  });

  it('should allow admin to delete leads', async () => {
    const res = await request(app).delete(`/api/leads/${leadId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
