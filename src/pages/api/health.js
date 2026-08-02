import { pingDatabase } from '@/lib/mysql';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const isHealthy = await pingDatabase();
  return res.status(200).json({ ok: isHealthy, message: isHealthy ? 'Database is reachable' : 'Database connection unavailable' });
}
