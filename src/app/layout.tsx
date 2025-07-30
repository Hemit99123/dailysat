import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import { ToastContainer } from "react-toastify";
import 'katex/dist/katex.min.css';
import Root from "@/components/common/Root";

export const metadata: Metadata = {
  title: "DailySAT",
  description:
    "Practice for the SAT with ease! DailySAT offers a broad range of SAT practice questions through a gamified experience.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className="antialiased vsc-initialized">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <Root 
            childern={children}
          />
        </GoogleOAuthProvider>
        <Analytics />
        <ToastContainer></ToastContainer>
      </body>
    </html>
  );
}
