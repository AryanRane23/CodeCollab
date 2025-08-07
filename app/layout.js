import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper"; // next-auth 

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
      
        {/* wrapped body in SessionWrapper */}
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
         
          
          {children}
          
           </SessionWrapper>
      </body>
      
    </html>
  );
}
