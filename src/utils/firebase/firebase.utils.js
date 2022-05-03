import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import { 
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyCYaqgJbl72R_qZLtc2O9HmjP9X8-1am10",
    authDomain: "crwn-db-e31fa.firebaseapp.com",
    projectId: "crwn-db-e31fa",
    storageBucket: "crwn-db-e31fa.appspot.com",
    messagingSenderId: "132540789602",
    appId: "1:132540789602:web:34f3120da7eb8fb6e2f23b",
    measurementId: "G-DH0ZCDM5KE"
  };

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ 
    prompt: 'select_account'
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const signInWithAccount = async (email, password) => {
  if(!email || !password) return;

  const signInUser =  await signInWithEmailAndPassword(auth, email, password);
  return signInUser;
}

export const crearUserDocumentFromAuth = async (userAuth, additionalInformation) => {
  if(!userAuth) return;
  const userDocRef =  doc(db, 'users', userAuth.uid);

  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);

  if(!userSnapshot.exists()){
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      });
    }
    catch (error) {
      console.log('Error creating the user', error.message);
    }
  }

  return userDocRef;
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if(!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async () => await signOut(auth);

export default firebase;