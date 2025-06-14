// import { getFirestore } from "firebase-admin/firestore";
// import "@/lib/firebase-admin"; // Ensures Admin SDK is initialized

// export async function getSections() {
//   const db = getFirestore();
//   const snapshot = await db.collection("sections").get();

//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// }
