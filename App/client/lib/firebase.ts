// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMYrPBDKa44vMseGWHb8TGgek2_Mi2wIw",
  authDomain: "reward-coins-app-a9af0.firebaseapp.com",
  projectId: "reward-coins-app-a9af0",
  storageBucket: "reward-coins-app-a9af0.firebasestorage.app",
  messagingSenderId: "590301179268",
  appId: "1:590301179268:web:8ba2138b990f0893f441d1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

// 🔐 Sign in with Google + Debugging
export function signInWithGoogle() {
  console.log("🔥 Attempting Firebase Google Sign-In...");
  console.log("🌐 Current domain:", window.location.hostname);
  console.log("🔧 Firebase Auth Domain:", firebaseConfig.authDomain);

  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log("✅ Firebase Auth Success!", result.user?.email);
      return result;
    })
    .catch((error) => {
      console.error("❌ Firebase Auth Error Details:");
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      console.error("Full Error:", error);

      if (error.code === "auth/operation-not-allowed") {
        console.error("🚨 GOOGLE SIGN-IN NOT ENABLED!");
        console.error("👉 Go to: https://console.firebase.google.com/project/reward-coins-app-a9af0/authentication/providers");
        console.error("👉 Click 'Google' provider and ENABLE it");

        return {
          user: {
            displayName: "Demo User (Google Sign-In Disabled)",
            email: "demo@rewardcoins.app",
            photoURL: "/placeholder.svg",
            uid: "demo-user-" + Date.now(),
          },
        };
      } else if (error.code === "auth/unauthorized-domain") {
        console.error("🚨 DOMAIN NOT AUTHORIZED!");
        console.error("👉 Add this domain to 'Authorized domains':", window.location.hostname);
      }

      throw error;
    });
}

// 💰 Fetch user's current coin balance
export async function fetchUserCoins(email: string): Promise<number> {
  const userRef = doc(collection(db, "users"), email);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return data.coins || 0;
  } else {
    await setDoc(userRef, { coins: 0 });
    return 0;
  }
}

// ➕ Increment coins securely in Firestore
export async function incrementCoins(
  email: string,
  amount: number
): Promise<void> {
  const userRef = doc(collection(db, "users"), email);
  await updateDoc(userRef, {
    coins: increment(amount),
  }).catch(async () => {
    // Create user document if not found
    await setDoc(userRef, { coins: amount });
  });
}
