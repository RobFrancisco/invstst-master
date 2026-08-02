import { query } from '@/lib/mysql';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const rows = await query('SELECT * FROM users ORDER BY created_date DESC');
      return res.status(200).json(rows.map((user) => ({ ...user, password: undefined })));
    } catch (error) {
      return res.status(500).json({ message: 'Unable to load users', error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { full_name, email, password, role, status } = req.body || {};
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required' });
    }

    try {
      const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [String(email).trim().toLowerCase()]);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'A user with this email already exists' });
      }

      const created = await query(
        'INSERT INTO users (full_name, email, password, role, status, created_date) VALUES (?, ?, ?, ?, ?, NOW())',
        [String(full_name).trim(), String(email).trim().toLowerCase(), String(password), String(role || 'staff').toLowerCase(), String(status || 'active').toLowerCase()]
      );

      const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [created.insertId]);
      const user = rows[0];
      return res.status(201).json({ ...user, password: undefined });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to create user', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: 'Method not allowed' });
}
