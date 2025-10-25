"use client";

import { useState } from "react";
import { useCreateSession } from "@/hooks/useSession";
import { useSession } from "@/contexts/SessionContext";
import { toast } from "sonner";

const HeroSection = () => {
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { sessionId, isLoggedIn, isInitialized, setSessionId } = useSession();

  const { mutate: createSessionMutation, isPending } = useCreateSession();

  const handleStartClick = () => {
    // Case 1: Already logged in → just scroll to Main section
    if (isLoggedIn && sessionId) {
      const mainSection = document.getElementById("main-experiment");
      if (mainSection) {
        mainSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    // Case 2: Not logged in but session exists → recover session
    if (!isLoggedIn && sessionId) {
      // Re-login with existing session ID
      setSessionId(sessionId);
      // Scroll to main section
      setTimeout(() => {
        const mainSection = document.getElementById("main-experiment");
        if (mainSection) {
          mainSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }

    // Case 3: Not logged in and no session → create new session
    setIsCreatingSession(true);
    createSessionMutation(undefined, {
      onSuccess: () => {
        // Context will auto re-render the page to show Main component
        // Scroll to main section after a small delay for rendering
        setIsCreatingSession(false);
        setTimeout(() => {
          const mainSection = document.getElementById("main-experiment");
          if (mainSection) {
            mainSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      },
      onError: (error) => {
        console.error("Error creating session:", error);
        setIsCreatingSession(false);
        toast.error("Failed to create session. Please try again.");
      },
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Gradient starting from top (below navbar) */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Main gradient - deeper blue flowing to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-400 via-60% to-white to-95%"></div>

        {/* Radial accent at top */}
        <div className="absolute top-0 left-0 right-0 h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3),transparent_70%)]"></div>

        {/* Subtle side accent */}
        <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.2),transparent_70%)]"></div>
      </div>

      {/* Minimal floating orbs for subtle depth */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-32 left-10 w-72 h-72 bg-gradient-to-br from-blue-100/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Floating SVG Artifacts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Neural Network - Top Left */}
        <div className="absolute top-32 left-16 opacity-25 animate-float">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="20" r="8" fill="white" stroke="white" strokeWidth="2" />
            <circle cx="30" cy="60" r="8" fill="white" stroke="white" strokeWidth="2" />
            <circle cx="90" cy="60" r="8" fill="white" stroke="white" strokeWidth="2" />
            <circle cx="60" cy="100" r="8" fill="white" stroke="white" strokeWidth="2" />
            <circle cx="20" cy="90" r="6" fill="white" stroke="white" strokeWidth="2" />
            <circle cx="100" cy="90" r="6" fill="white" stroke="white" strokeWidth="2" />
            <line x1="60" y1="28" x2="30" y2="52" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="60" y1="28" x2="90" y2="52" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="30" y1="68" x2="60" y2="92" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="90" y1="68" x2="60" y2="92" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="60" y1="100" x2="20" y2="90" stroke="white" strokeWidth="2" opacity="0.6" />
            <line x1="60" y1="100" x2="100" y2="90" stroke="white" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        {/* Wrench - Right Middle */}
        <div className="absolute top-1/2 right-20 opacity-25 animate-float-delayed">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 25C75 19.48 70.52 15 65 15C59.48 15 55 19.48 55 25C55 27.39 55.83 29.59 57.24 31.31L30 58.55L23.45 52L20 55.45L15 60.45L18.55 64L12 70.55L29.45 88L36 81.45L39.55 85L44.55 80L48 76.55L41.45 70L68.69 42.76C70.41 44.17 72.61 45 75 45C80.52 45 85 40.52 85 35C85 29.48 80.52 25 75 25ZM65 35C62.24 35 60 32.76 60 30C60 27.24 62.24 25 65 25C67.76 25 70 27.24 70 30C70 32.76 67.76 35 65 35Z" fill="white" />
          </svg>
        </div>

        {/* Lab Flask - Bottom Left */}
        <div className="absolute bottom-32 left-24 opacity-25 animate-float">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 10H55V35L70 60C72.5 64 70 70 65 70H25C20 70 17.5 64 20 60L35 35V10Z" stroke="white" strokeWidth="3" fill="none" />
            <path d="M30 10H60" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <circle cx="40" cy="55" r="4" fill="white" opacity="0.6" />
            <circle cx="52" cy="50" r="3" fill="white" opacity="0.6" />
            <circle cx="35" cy="62" r="2.5" fill="white" opacity="0.6" />
            <path d="M35 40L55 40" stroke="white" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>

        {/* Settings Gear - Top Right */}
        <div className="absolute top-40 right-32 opacity-25 animate-float-delayed">
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M55 35C43.95 35 35 43.95 35 55C35 66.05 43.95 75 55 75C66.05 75 75 66.05 75 55C75 43.95 66.05 35 55 35ZM55 65C49.48 65 45 60.52 45 55C45 49.48 49.48 45 55 45C60.52 45 65 49.48 65 55C65 60.52 60.52 65 55 65Z" fill="white" />
            <path d="M88.5 51.5L83 48.5C83.3 46.7 83.3 44.8 83 43L88.5 40C89.3 39.6 89.7 38.6 89.3 37.8L84.8 29.2C84.4 28.4 83.4 28 82.6 28.4L77.1 31.4C75.6 30.2 73.9 29.2 72.1 28.5L71.1 22.5C71 21.6 70.2 21 69.3 21H60.7C59.8 21 59 21.6 58.9 22.5L57.9 28.5C56.1 29.2 54.4 30.2 52.9 31.4L47.4 28.4C46.6 28 45.6 28.4 45.2 29.2L40.7 37.8C40.3 38.6 40.7 39.6 41.5 40L47 43C46.7 44.8 46.7 46.7 47 48.5L41.5 51.5C40.7 51.9 40.3 52.9 40.7 53.7L45.2 62.3C45.6 63.1 46.6 63.5 47.4 63.1L52.9 60.1C54.4 61.3 56.1 62.3 57.9 63L58.9 69C59 69.9 59.8 70.5 60.7 70.5H69.3C70.2 70.5 71 69.9 71.1 69L72.1 63C73.9 62.3 75.6 61.3 77.1 60.1L82.6 63.1C83.4 63.5 84.4 63.1 84.8 62.3L89.3 53.7C89.7 52.9 89.3 51.9 88.5 51.5Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="font-serif text-center text-[48px] leading-[110%] font-medium tracking-[-1px] text-white lg:text-[80px] lg:leading-[102%] mb-4">
          <span className="block lg:overflow-hidden lg:h-[82px]">
            <span className="inline-block">See</span>{" "}
            <span className="inline-block">how</span>{" "}
            <span className="inline-block">AI</span>{" "}
            <span className="inline-block">thinks</span>
          </span>
          <span className="block lg:overflow-hidden lg:h-[82px]">
            <span className="inline-block">when</span>{" "}
            <span className="inline-block">you</span>{" "}
            <span className="inline-block">turn</span>{" "}
            <span className="inline-block">the</span>{" "}
            <span className="inline-block">dials</span>
          </span>
        </h1>

        {/* Horizontal Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-4" aria-hidden="true"></div>

        {/* Subtitle - Clean and Simple */}
        <p className="text-lg md:text-xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed font-sans">
          Play with the settings, compare different answers, and discover what makes great AI responses.
        </p>

        {/* Single CTA Button - Premium with shimmer */}
        <button
          onClick={handleStartClick}
          disabled={isCreatingSession}
          aria-label={isCreatingSession ? "Creating session..." : isLoggedIn ? "Start experimenting with AI parameters" : sessionId ? "Recover your previous session" : "Start experimenting with AI parameters"}
          className="relative overflow-hidden rounded-[20px] px-8 py-4 text-base font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4),0_16px_64px_rgba(74,104,214,0.3)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5),0_20px_80px_rgba(74,104,214,0.4)] transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Blurred border overlay */}
          <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1.5px]" aria-hidden="true">
            <span className="absolute -top-px -left-px z-20 h-full w-full border-2 border-white/30 rounded-[20px]"></span>
          </span>

          {/* Shimmer effect */}
          {!isCreatingSession && (
            <span className="absolute -top-4 -left-12 h-[153px] w-[54px] opacity-50 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-xl group-hover:animate-shimmer" aria-hidden="true"></span>
          )}

          <span className="relative z-30 flex items-center gap-2">
            {isCreatingSession ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="sr-only">Creating session, please wait...</span>
                Generating Session...
              </>
            ) : isLoggedIn ? (
              "Start Experimenting"
            ) : sessionId ? (
              "Recover Session"
            ) : (
              "Start Experimenting"
            )}
          </span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;