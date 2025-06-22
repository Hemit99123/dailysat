"use client";

import { signIn } from "@/lib/auth/authClient";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const GoogleSignInPage: React.FC = () => {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 overflow-hidden">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl p-10 rounded-2xl text-center 
                      animate-slideIn">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/favicon.ico"
            alt="DailySAT Logo"
            width={48}
            height={48}
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Sign into DailySAT
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          You need to sign in to access this feature. We use Google to keep it simple and secure.
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={() =>
            signIn.social({
              provider: "google",
              callbackUrl: window.location.href,
            })
          }
          className="w-full bg-white dark:bg-gray-700 text-black dark:text-white py-3 px-4 rounded-lg 
                     hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-center items-center gap-3 
                     border border-gray-300 dark:border-gray-600 text-lg"
        >
          <FcGoogle size={28} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleSignInPage;
