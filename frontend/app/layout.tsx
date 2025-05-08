import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "thesius.ai",
  description: "Don't research alone !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`bg-cover bg-center ${geistSans.variable} ${geistMono.variable} antialiased`}
          style={{
            backgroundSize: "100% 100%",
            backgroundPosition: "0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px",
            backgroundImage: `
            radial-gradient(113% 91% at 17% -2%, #FFFFFFFF 1%, #FF000000 99%),
            radial-gradient(142% 91% at 83% 7%, #86EFACFF 24%, #FF000000 99%),
            radial-gradient(142% 91% at -6% 74%, #86EFAC75 13%, #FF000000 99%),
            conic-gradient(from 60deg at 50% 50%, #86EFAC 1%, #FFFFFFFF 100%)
          `,
            backgroundRepeat: "no-repeat",
          }}
        >
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
