import { query } from '@/lib/mysql';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [String(email).trim().toLowerCase()]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (String(user.password) !== String(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (String(user.status).toLowerCase() !== 'active') {
      return res.status(403).json({ message: 'This account is inactive' });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
      created_date: user.created_date,
    };

    return res.status(200).json({ user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to authenticate user', error: error.message });
  }
}
