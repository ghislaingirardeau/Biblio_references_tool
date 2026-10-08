import admin from '../firebaseAdmin.js';

const db = admin.firestore();
const MAX_CALLS = 50;
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const userCache = new Map(); // { uid: { count, start, lastSync } }

export async function rateLimitByUser(req, res, next) {
  const uid = req.user.uid;

  console.log('uid', uid);

  const now = Date.now();

  // Fetch ApiUsage info from firestore
  const ref = db.collection('users').doc(uid);
  const doc = await ref.get();

  let data = { count: 1, start: now, limit: 50 };

  // if no info, first time using it, so set apiUsage
  if (!doc.exists) {
    await ref.set({ apiUsage: data });
    return next();
  }

  if (doc.exists && doc.data().apiUsage) {
    data = doc.data().apiUsage;
  }

  data.count += 1;

  if (data.count > data.limit) return res.status(429).json({ message: 'Limit reach' });
  await ref.update({ apiUsage: data });

  next();
}
