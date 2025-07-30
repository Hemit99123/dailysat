"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { menuItems } from "@/data/common/navbar";
import { determineAuthStatus } from "@/lib/auth/authStatus";
import { useEffect, useState, useRef } from "react";
import { signIn, signOut } from "@/lib/auth/authClient";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 60], [0, -20]);
  const opacity = useTransform(scrollY, [0, 60], [1, 0.9]);

  const [auth, setAuth] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [isPracticeBoxVisible, setIsPracticeBoxVisible] = useState(false);
  const practiceAreaRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to get the actual height of the navbar
  const navBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await determineAuthStatus();
      setAuth(authStatus);
    };
    checkAuth();
  }, []);

  // Effect to set the CSS variable for navbar height
  useEffect(() => {
    if (navBarRef.current) {
      const height = navBarRef.current.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      console.log(`[NavBar Height] --navbar-height set to: ${height}px`);
    }
  }, [navBarRef.current, menuOpen]); // Recalculate if menuOpen changes (for mobile height)

  const handleAuthClick = async () => {
    setMenuOpen(false);
    if (auth) {
      await signOut();
      router.push("/auth/success");
    } else {
      await signIn.social({ provider: "google" });
    }
  };

  const isHome = pathname === "/";

  const theme = {
    bg: isHome
      ? "bg-gradient-to-br from-blue-100 via-white to-purple-100"
      : "bg-white",
    text: isHome ? "text-gray-800" : "text-gray-800",
    hover: "hover:text-blue-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    buttonText: "text-white",
  };

  const handlePracticeAreaMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (!isPracticeBoxVisible) {
      setIsPracticeBoxVisible(true);
    }
  };

  const handlePracticeAreaMouseLeave = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsPracticeBoxVisible(false);
    }, 200);
  };

  const handleDropdownLinkClick = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsPracticeBoxVisible(false);
  };

  return (
    <motion.div
      ref={navBarRef} // Attach ref to the outermost navbar element
      style={{ y, opacity }}
      className={cn(
        "top-0 z-50 transition-all duration-300 shadow-sm border-b border-white/50 backdrop-blur-md fixed w-full",
        theme.bg
      )}
    >
      <nav className="mx-auto flex items-center justify-between px-6 py-4 max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className={cn("flex items-center text-xl font-extrabold", theme.text)}
        >
          <Image
            src="/logo/dailysat.png"
            width={40}
            height={40}
            alt="DailySAT Logo"
            className="drop-shadow-sm"
          />
          <span className="ml-2 tracking-tight">DailySAT</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn("md:hidden p-2", theme.text)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={item.label === "Practice" ? handlePracticeAreaMouseEnter : undefined}
              onMouseLeave={item.label === "Practice" ? handlePracticeAreaMouseLeave : undefined}
              ref={item.label === "Practice" ? practiceAreaRef : null}
            >
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-blue-600 underline underline-offset-4"
                    : `${theme.text} ${theme.hover}`
                )}
              >
                {item.label}
              </Link>

              {item.label === "Practice" && isPracticeBoxVisible && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-3 p-1 bg-white border border-gray-200 rounded-xl shadow-lg w-[200px] z-[9999]"
                  style={{
                    filter:
                      "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
                  }}
                >
                  <div className="absolute left-1/2 -top-[9px] transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45 rounded-sm"></div>
                  <ul className="text-sm space-y-1 py-2">
                    <li className="flex items-center space-x-3 px-3 py-2">
                      <Link
                        href="/practice/math"
                        className="text-gray-700 font-semibold text-base flex items-center space-x-2 w-full block rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={handleDropdownLinkClick}
                      >
                        <span className="text-xl">🧮</span> <span>Math</span>
                      </Link>
                    </li>
                    <div className="border-b border-gray-200 my-1"></div>
                    <li className="flex items-center space-x-3 px-3 py-2">
                      <div className="flex flex-col w-full">
                        <Link
                          href="/practice/english"
                          className="text-gray-700 font-semibold text-base flex items-center space-x-2 w-full block rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={handleDropdownLinkClick}
                        >
                          <span className="text-xl">📝</span>{" "}
                          <span>English</span>
                        </Link>
                        <Link
                          href="/practice/vocab"
                          className="text-gray-500 text-sm mt-0.5 ml-8 flex items-center space-x-1 w-5/6 block rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={handleDropdownLinkClick}
                        >
                          <span className="text-base">📖</span>{" "}
                          <span>Vocabulary</span>
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex items-center space-x-4">
          {auth === null ? (
            <Skeleton className="w-[82px] h-[35px] rounded-full bg-blue-600" />
          ) : (
            <button
              onClick={handleAuthClick}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                theme.buttonBg,
                theme.buttonText,
                theme.buttonHover
              )}
            >
              {auth ? "Log out" : "Sign in"}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col space-y-4 px-6 pb-4"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleAuthClick}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200"
            >
              {auth ? "Log out" : "Sign in"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavBar;