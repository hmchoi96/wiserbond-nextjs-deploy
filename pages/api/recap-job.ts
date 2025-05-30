// /pages/api/recap-job.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { runRecapJob } from '@/utils/recapJob';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method allowed' });
  }

  try {
    await runRecapJob();
    res.status(200).json({ message: 'Recap job executed successfully.' });
  } catch (error) {
    console.error('❌ Recap job failed:', error);
    res.status(500).json({ message: 'Internal server error while executing recap job.' });
  }
}
