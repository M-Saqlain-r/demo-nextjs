// lib/firebase-admin.ts
import admin from 'firebase-admin'

import { initializeApp, cert } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

initializeApp({
  credential: cert(serviceAccount),
});

export default admin
