import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function getCollection() {
  await client.connect();
  return client.db('crazy_click').collection('leader_board');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const col = await getCollection();

    if (req.method === 'GET') {
      const limit = Math.min(parseInt(String(req.query.limit ?? '100'), 10), 100);
      const entries = await col
        .find({}, { projection: { _id: 0, id: 1, name: 1, score: 1, createdAt: 1 } })
        .sort({ score: -1 })
        .limit(limit)
        .toArray();
      return res.status(200).json(entries);
    }

    if (req.method === 'POST') {
      const { name, score } = req.body as { name?: string; score?: number };

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'name is required' });
      }
      if (typeof score !== 'number' || score < 0 || score > 10000) {
        return res.status(400).json({ error: 'invalid score' });
      }

      const entry = {
        id: crypto.randomUUID(),
        name: name.trim().slice(0, 20),
        score,
        createdAt: Date.now(),
      };
      await col.insertOne(entry);
      return res.status(201).json(entry);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
