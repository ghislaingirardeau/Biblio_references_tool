import admin from '../firebaseAdmin.js';

const db = admin.firestore();
const MAX_CALLS = 50;
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const userCache = new Map(); // { uid: { count, start, lastSync } }

export async function rateLimitByUser(req, res, next) {
  const uid = req.user.uid;

  const now = Date.now();
  const cached = userCache.get(uid);

  if (cached && now - cached.lastSync < 60_000) {
    // rafraîchit toutes les 60s
    cached.count++;
    if (cached.count > MAX_CALLS) return res.status(429).json({ message: 'Limit reach' });
    return next();
  }

  // Sinon : recharge depuis Firestore
  const ref = db.collection('users').doc(uid);
  const doc = await ref.get();
  let data = doc.exists && doc.data().apiUsage ? doc.data().apiUsage : { count: 0, start: now };

  if (now - data.start > WINDOW_MS) data = { count: 0, start: now };
  data.count += 1;

  userCache.set(uid, { ...data, lastSync: now });

  if (data.count > MAX_CALLS) return res.status(429).json({ message: 'Limit reach' });

  next();
  await ref.update({ apiUsage: data });
}
