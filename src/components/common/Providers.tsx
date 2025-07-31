"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./NavBar";
import { Analytics } from "@vercel/analytics/next";

export default function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <NavBar />
      {children}
      <Analytics />
      <ToastContainer limit={1} />
    </GoogleOAuthProvider>
  );
}
