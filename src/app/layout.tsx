import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import ClientRootWrapper from "@/components/common/ClientRootWrapper";

export const metadata: Metadata = {
  title: "DailySAT",
  description:
    "DailySAT is an online SAT question bank that students can use to practice for the SAT.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <ClientRootWrapper>{children}</ClientRootWrapper>
        <Analytics />
      </body>
    </html>
  );
}
