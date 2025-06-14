import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

export async function GET() {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      createdAt: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('❌ Firebase Admin Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
