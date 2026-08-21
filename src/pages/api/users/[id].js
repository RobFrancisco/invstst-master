import { query } from '@/lib/mysql';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      if (!rows[0]) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json({ ...rows[0], password: undefined });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to load user', error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const { full_name, email, password, role, status } = req.body || {};

    try {
      const existing = await query('SELECT id FROM users WHERE id = ? LIMIT 1', [id]);
      if (!existing[0]) return res.status(404).json({ message: 'User not found' });

      if (email) {
        const duplicate = await query('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [String(email).trim().toLowerCase(), id]);
        if (duplicate[0]) return res.status(409).json({ message: 'A user with this email already exists' });
      }

      const updates = [];
      const values = [];

      if (full_name !== undefined) {
        updates.push('full_name = ?');
        values.push(String(full_name).trim());
      }
      if (email !== undefined) {
        updates.push('email = ?');
        values.push(String(email).trim().toLowerCase());
      }
      if (password !== undefined) {
        updates.push('password = ?');
        values.push(String(password));
      }
      if (role !== undefined) {
        updates.push('role = ?');
        values.push(String(role).toLowerCase());
      }
      if (status !== undefined) {
        updates.push('status = ?');
        values.push(String(status).toLowerCase());
      }

      if (updates.length > 0) {
        values.push(id);
        await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
      }

      const rows = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
      return res.status(200).json({ ...rows[0], password: undefined });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to update user', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await query('DELETE FROM users WHERE id = ?', [id]);
      return res.status(200).json({ success: true });
    } catch (error) {
      // If delete fails due to foreign key constraints (user has related records),
      // fallback to marking the user as inactive instead of hard-deleting.
      if (error && (error.errno === 1451 || error.code === 'ER_ROW_IS_REFERENCED_2')) {
        try {
          await query('UPDATE users SET status = ? WHERE id = ?', ['inactive', id]);
          return res.status(200).json({ success: true, softDeleted: true, message: 'User has related records; marked as inactive instead.' });
        } catch (e) {
          return res.status(500).json({ message: 'Unable to soft-delete user', error: e.message });
        }
      }
      return res.status(500).json({ message: 'Unable to delete user', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: 'Method not allowed' });
}
