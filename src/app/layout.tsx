import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import { ToastContainer } from "react-toastify";
import 'katex/dist/katex.min.css';
import NavBar from "@/components/common/NavBar"; // Corrected path based on your previous messages

export const metadata: Metadata = {
  title: "DailySAT",
  description:
    "Practice for the SAT with ease! DailySAT offers a broad range of SAT practice questions through a gamified experience.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      {/* Apply antialiased class directly to html or body as needed, 
          but vsc-initialized is likely added by an extension and not needed here */}
      <body className="antialiased">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          {/* NavBar is correctly placed outside the content wrapper as it's fixed */}
          <NavBar />
          {/* This div applies padding-top using the CSS variable set by NavBar */}
          {/* Ensure your main content that should NOT be behind the navbar is inside this div */}
          <div style={{ paddingTop: 'var(--navbar-height)' }}>
            {children}
          </div>
        </GoogleOAuthProvider>
        <Analytics />
        <ToastContainer /> {/* ToastContainer doesn't need to be self-closing */}
      </body>
    </html>
  );
}