import { Geist, Geist_Mono } from "next/font/google";
import { Arimo } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper"; // next-auth 
import Script from "next/script"; 

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "700"], // you choose available weights
});

const geistSans = Geist({
  variable: "--font-geist-sans  ",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CodeCollab ",
  description: "Collaborate Live",
};

export default function RootLayout({ children }) {
  console.log("SessionWrapper:", SessionWrapper); // Debug to confirm import
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/62743d1977.js"
          crossOrigin="anonymous"
          defer
        />
      </head>
      {/* wrapped body in SessionWrapper */}
      <body className={`${geistSans.variable} ${geistMono.variable} ${arimo.variable} antialiased`}>
        <SessionWrapper>


          {children}

        </SessionWrapper>
      </body>

    </html>
  );
}
