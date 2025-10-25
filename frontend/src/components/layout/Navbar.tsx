"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMenu, IoClose, IoTerminal, IoChevronDown, IoTrash, IoFlask, IoLogOut } from "react-icons/io5";
import { useSession } from "@/contexts/SessionContext";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { sessionId, signOut: contextSignOut, deleteSession: contextDeleteSession } = useSession();

  // Force dark navbar on white background pages
  const isWhiteBackgroundPage = pathname !== '/';
  const showDarkNav = isScrolled || isWhiteBackgroundPage;

  const navItems = [
    { name: "Try it Out", href: "/#hero" },
    { name: "Experiments", href: "/experiments" },
  ];

  useEffect(() => {
    // Handle scroll detection
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + 100; // 100px offset for smoother transition
        setIsScrolled(scrollPosition > heroBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const truncateSessionId = (id: string) => {
    if (id.length <= 12) return id;
    return `0x${id.slice(0, 3)}....${id.slice(-4)}`;
  };

  const handleSignOut = () => {
    // Clear logged-in state but keep session ID for recovery
    contextSignOut();
    setShowDropdown(false);
    window.location.href = "/";
  };

  const handleDeleteSession = () => {
    // Permanently delete session from both storage
    contextDeleteSession();
    setShowDeleteModal(false);
    setShowDropdown(false);
    window.location.href = "/";
  };

  return (
    <>
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showDarkNav ? "bg-white/50 backdrop-blur-md shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side - Logo and Nav Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 group cursor-pointer"
              aria-label="LLM Lab home page"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#1e3a8a] rounded-lg blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-[#1e3a8a] p-2 rounded-lg shadow-sm">
                  <IoTerminal className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors duration-300 ${
                showDarkNav ? "text-gray-900" : "text-white"
              }`}>
                LLM Lab
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    showDarkNav
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button / Session Dropdown */}
          <div className="hidden md:flex items-center relative" ref={dropdownRef}>
            {sessionId ? (
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-label={`Session menu ${truncateSessionId(sessionId)}`}
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                  className="relative overflow-hidden rounded-[20px] px-6 py-3 text-sm font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4),0_16px_64px_rgba(74,104,214,0.3)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5),0_20px_80px_rgba(74,104,214,0.4)] transition-all duration-300 group flex items-center gap-2"
                >
                  {/* Blurred border overlay */}
                  <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1.5px]" aria-hidden="true">
                    <span className="absolute -top-px -left-px z-20 h-full w-full border-2 border-white/30 rounded-[20px]"></span>
                  </span>

                  {/* Shimmer effect */}
                  <span className="absolute -top-4 -left-12 h-[153px] w-[54px] opacity-50 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-xl group-hover:animate-shimmer" aria-hidden="true"></span>

                  <span className="relative z-30 flex items-center gap-2">
                    {truncateSessionId(sessionId)}
                    <IoChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    role="menu"
                    aria-label="Session options"
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 divide-y divide-gray-100"
                  >
                    <div className="py-1">
                      <Link
                        href="/experiments"
                        onClick={() => setShowDropdown(false)}
                        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <IoFlask className="w-4 h-4" />
                        <span className="font-medium">View Experiments</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <IoLogOut className="w-4 h-4" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setShowDeleteModal(true);
                        }}
                        className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <IoTrash className="w-4 h-4" />
                        <span className="font-medium">Delete Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link href="/#hero" className="relative overflow-hidden rounded-[20px] px-6 py-3 text-sm font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4),0_16px_64px_rgba(74,104,214,0.3)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5),0_20px_80px_rgba(74,104,214,0.4)] transition-all duration-300 group block">
                {/* Blurred border overlay */}
                <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1.5px]" aria-hidden="true">
                  <span className="absolute -top-px -left-px z-20 h-full w-full border-2 border-white/30 rounded-[20px]"></span>
                </span>

                {/* Shimmer effect */}
                <span className="absolute -top-4 -left-12 h-[153px] w-[54px] opacity-50 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-xl group-hover:animate-shimmer" aria-hidden="true"></span>

                <span className="relative z-30">Get Started</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className={`p-2 rounded-lg transition-colors ${
                showDarkNav
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {isOpen ? <IoClose className="w-5 h-5" aria-hidden="true" /> : <IoMenu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            id="mobile-menu"
            className={`md:hidden absolute top-16 left-0 right-0 backdrop-blur-md shadow-lg ${
              showDarkNav ? "bg-white/95" : "bg-blue-600/95"
            }`}
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                    showDarkNav
                      ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {sessionId ? (
                <div className={`pt-4 space-y-2 mt-4 ${
                  showDarkNav ? "border-t border-gray-200" : "border-t border-white/20"
                }`}>
                  <div className={`px-4 py-2 text-sm font-semibold ${
                    showDarkNav ? "text-gray-500" : "text-white/70"
                  }`}>
                    Session: {truncateSessionId(sessionId)}
                  </div>
                  <Link
                    href="/experiments"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      showDarkNav
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <IoFlask className="w-4 h-4" />
                    View Experiments
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      showDarkNav
                        ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <IoLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowDeleteModal(true);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      showDarkNav
                        ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                        : "text-red-300 hover:text-red-200 hover:bg-white/10"
                    }`}
                  >
                    <IoTrash className="w-4 h-4" />
                    Delete Session
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <Link href="/#hero" className="relative overflow-hidden rounded-[20px] px-6 py-3 text-sm font-semibold text-white bg-[#4A68D6] hover:bg-[#3B59C5] shadow-[0_8px_32px_rgba(74,104,214,0.4),0_16px_64px_rgba(74,104,214,0.3)] hover:shadow-[0_12px_48px_rgba(74,104,214,0.5),0_20px_80px_rgba(74,104,214,0.4)] transition-all duration-300 group w-full block text-center" onClick={() => setIsOpen(false)}>
                    {/* Blurred border overlay */}
                    <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1.5px]" aria-hidden="true">
                      <span className="absolute -top-px -left-px z-20 h-full w-full border-2 border-white/30 rounded-[20px]"></span>
                    </span>

                    {/* Shimmer effect */}
                    <span className="absolute -top-4 -left-12 h-[153px] w-[54px] opacity-50 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-xl group-hover:animate-shimmer" aria-hidden="true"></span>

                    <span className="relative z-30">Get Started</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Delete Session Modal - Outside nav for proper positioning */}
    {showDeleteModal && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => setShowDeleteModal(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2.5 rounded-lg">
                  <IoTrash className="w-5 h-5 text-red-600" aria-hidden="true" />
                </div>
                <h3 id="delete-modal-title" className="text-xl font-bold text-gray-900">Delete Session?</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                aria-label="Close modal"
              >
                <IoClose className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <p id="delete-modal-description" className="text-gray-700 text-sm mb-6 leading-relaxed">
              This will permanently erase your session and all experiments. This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSession}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;