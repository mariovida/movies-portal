import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "@/styles/main.scss";
import { ThemeProvider } from "@/context/ThemeContext";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '700'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: "Movies portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
