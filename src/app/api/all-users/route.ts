// import { NextResponse } from 'next/server';
// import { getAuth } from 'firebase-admin/auth';
// import { getApps, initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';

// if (!getApps().length) {
//   initializeApp({
//     credential: cert({
//       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//       clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     }),
//   });
// }

// export async function GET() {
//   try {
//     const auth = getAuth();
//     const db = getFirestore();

//     const listUsersResult = await auth.listUsers();

//     const users = await Promise.all(
//       listUsersResult.users.map(async (user) => {
//         const docSnap = await db.collection('users').doc(user.uid).get();
//         const data = docSnap.exists ? docSnap.data() : {};

//         return {
//           uid: user.uid,
//           email: user.email,
//           name: data?.name || '',
//           lastLogin: data?.lastLogin || null,
//           isLogin: data?.isLogin || false,
//         };
//       })
//     );

//     const activeUsers = users.filter((u) => u.isLogin && u.lastLogin);

//     return NextResponse.json({ activeUsers });
//   } catch (error: any) {
//     console.error('[API ERROR]', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
