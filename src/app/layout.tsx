import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/common/NavBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "DailySAT",
  description: "DailySAT is an online SAT question bank that students can use to practice for the SAT.",
};

export default function RootLayout({
  children,
}: React.PropsWithChildren) {


  return (
    <html lang="en">
      <body className="antialiased">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
          <NavBar />
          {children}
          <Analytics />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
