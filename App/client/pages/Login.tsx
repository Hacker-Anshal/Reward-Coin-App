import { useState } from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithGoogle, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Google icon component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92..." />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57..." />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09..." />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15..." />
  </svg>
);

interface User {
  name: string;
  email: string;
  picture: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const saveUserToFirestore = async (user: User) => {
  try {
    const userRef = doc(db, "users", user.email);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.name,
        email: user.email,
        picture: user.picture,
        coins: 0,
        createdAt: serverTimestamp(),
      });
      console.log("✅ Welcome");
    } else {
      console.log("👋 Welcome Back");
    }
  } catch (error) {
    console.error("❌ An Error Occurred:", error);
  }
};

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);

    try {
      const result = await signInWithGoogle();
      const user = (result as any).user;

      const userData: User = {
        name: user.displayName || "User",
        email: user.email || "",
        picture: user.photoURL || "/placeholder.svg",
      };

      await saveUserToFirestore(userData); // ✅ Add this line
      onLogin(userData);

      toast({
        title: "Welcome!",
        description: `Successfully signed in as ${userData.name}`,
      });
    } catch (error: any) {
      console.error("Sign-in error:", error);

      let errorMessage = "Failed to sign in with Google";
      if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Google Sign-In is disabled in Firebase. Check console for setup instructions.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage = "This domain is not authorized. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* App Logo and Welcome Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <Coins className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Welcome to</h1>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Reward Coins App
            </h2>
            <p className="text-slate-600 text-lg">
              Sign in to continue and earn rewards
            </p>
          </div>
        </div>

        {/* Sign-in Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              size="lg"
            >
              <div className="flex items-center justify-center space-x-3">
                <GoogleIcon />
                <span className="text-lg font-medium">
                  {isSigningIn ? "Signing in..." : "Sign in with Google"}
                </span>
              </div>
            </Button>
            <div className="text-center space-y-3">
              <p className="text-sm text-slate-500 leading-relaxed">
                We use your Google account to sync your rewards and provide a secure experience.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Coins className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-slate-600 font-medium">Earn Coins</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary text-xs font-bold">🎁</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Redeem Rewards</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary text-xs font-bold">📱</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Track History</p>
          </div>
        </div>
      </div>
    </div>
  );
}
