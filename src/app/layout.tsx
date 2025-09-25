import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BootstrapClient from "./bootstrap-client";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IUT CSE'24 Community",
  description: "Community platform for IUT CSE'24",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <script>
        var cursor = document.querySelector('.gradient');
        document.addEventListener('mousemove', function(e){
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
});
      </script> 
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <BootstrapClient />
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">{children}</div>
            <Footer/>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}


