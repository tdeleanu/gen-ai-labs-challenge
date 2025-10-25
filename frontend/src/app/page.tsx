"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Main from "@/components/Main/Main";
import { useSession } from "@/contexts/SessionContext";

export default function HomePage() {
  const { isLoggedIn } = useSession();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        {isLoggedIn && <Main />}
      </main>
      <Footer />
    </div>
  );
}