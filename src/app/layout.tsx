import type { Metadata } from "next";
import "./globals.css";
import 'katex/dist/katex.min.css';
import Providers from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "DailySAT",
  description:
    "Practice for the SAT with ease! DailySAT offers a broad range of SAT practice questions through a gamified experience.",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
