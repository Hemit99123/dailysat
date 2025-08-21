"use client"

import { useEffect } from "react";
import { signIn } from "@/lib/auth/authClient";

const GoogleSignInPage: React.FC = () => {
  useEffect(() => {
    // Automatically trigger Google sign-in when component mounts
    signIn.social({
      provider: "google",
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-lg font-medium text-gray-700">Redirecting...</span>
    </div>
  );
};

export default GoogleSignInPage;