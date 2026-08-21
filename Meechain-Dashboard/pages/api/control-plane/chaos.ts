import type { NextApiRequest, NextApiResponse } from 'next';

type ChaosResponse = {
  ok: boolean;
  enabled: boolean;
  updatedAt: string;
  note?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __MEECHAIN_CHAOS_MODE__: boolean | undefined;
}

function getChaosMode(): boolean {
  if (typeof global.__MEECHAIN_CHAOS_MODE__ !== 'boolean') {
    global.__MEECHAIN_CHAOS_MODE__ = false;
  }
  return global.__MEECHAIN_CHAOS_MODE__;
}

function setChaosMode(enabled: boolean): boolean {
  global.__MEECHAIN_CHAOS_MODE__ = enabled;
  return global.__MEECHAIN_CHAOS_MODE__;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChaosResponse | { error: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      enabled: getChaosMode(),
      updatedAt: new Date().toISOString(),
      note: 'In-memory control-plane flag for dashboard testing.',
    });
  }

  if (req.method === 'POST') {
    const enabled = Boolean(req.body?.enabled);

    return res.status(200).json({
      ok: true,
      enabled: setChaosMode(enabled),
      updatedAt: new Date().toISOString(),
      note: 'Chaos mode updated successfully.',
    });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
