const express = require('express');
const Lead = require('../models/Lead');
const { authenticate, authorize } = require('../middleware/auth');
const { logActivity } = require('../middleware/activity');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    if (req.user) {
      await logActivity(lead.id, req.user.id, 'created', 'Lead created');
    }
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const { page, limit, status, assigned_to, search } = req.query;
    const isMember = req.user.role === 'member';
    const result = await Lead.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      assigned_to: isMember ? req.user.id : assigned_to,
      search
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    if (req.user.role === 'member' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    if (req.user.role === 'member' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const oldStatus = lead.status;
    await Lead.update(req.params.id, req.body);
    if (req.body.status && req.body.status !== oldStatus) {
      await logActivity(req.params.id, req.user.id, 'status_change', `${oldStatus} → ${req.body.status}`);
    }
    if (req.body.notes) {
      await logActivity(req.params.id, req.user.id, 'note_added', req.body.notes.substring(0, 100));
    }
    await logActivity(req.params.id, req.user.id, 'updated', 'Lead updated');
    const updated = await Lead.findById(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    await Lead.delete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/activities', authenticate, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    if (req.user.role === 'member' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const db = require('../config/db');
    db.all(
      `SELECT a.*, u.name as user_name FROM activities a LEFT JOIN users u ON a.user_id = u.id WHERE a.lead_id = ? ORDER BY a.created_at DESC`,
      [req.params.id],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
