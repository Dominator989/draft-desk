import { Router } from 'express';
import db from '../database.js';
import { draftReply } from '../services/draft.js';

const router = Router();
const VALID_STATUS = ['New', 'Quoted', 'Won', 'Done'];

// List all enquiries, newest first.
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
  res.json(rows);
});

// Create a new enquiry.
router.post('/', (req, res) => {
  const { customer_name, contact, details } = req.body;
  if (!customer_name || !details) {
    return res.status(400).json({ error: 'customer_name and details are required' });
  }
  const result = db
    .prepare('INSERT INTO enquiries (customer_name, contact, details) VALUES (?, ?, ?)')
    .run(customer_name, contact ?? null, details);
  const row = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// Update status.
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${VALID_STATUS.join(', ')}` });
  }
  db.prepare("UPDATE enquiries SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .run(status, req.params.id);
  const row = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

// Generate an AI draft reply for an enquiry, save it, and return it.
router.post('/:id/draft', async (req, res) => {
  const row = db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });

  try {
    const draft = await draftReply({ customerName: row.customer_name, details: row.details });
    db.prepare("UPDATE enquiries SET draft = ?, updated_at = datetime('now') WHERE id = ?")
      .run(draft, row.id);
    res.json({ ...row, draft });
  } catch (err) {
    console.error('Draft generation failed:', err.message);
    res.status(502).json({ error: 'Could not generate a draft. Check your API key and model.' });
  }
});

export default router;
