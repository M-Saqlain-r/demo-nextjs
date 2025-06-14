import { auth, db } from "./config"
import { doc, updateDoc, setDoc } from "firebase/firestore"
import { sendEmailVerification, updateProfile } from "firebase/auth"

// Save name to Firestore
export const updateUserInFirestore = async (uid: string, name: string) => {
  const userRef = doc(db, "users", uid)
  await setDoc(userRef, { name }, { merge: true })
}

// Update Firebase Auth profile display name
export const updateUserDisplayName = async (name: string) => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name })
  }
}

// Send email verification
export const sendVerificationEmail = async () => {
  if (auth.currentUser && !auth.currentUser.emailVerified) {
    await sendEmailVerification(auth.currentUser)
  }
}
