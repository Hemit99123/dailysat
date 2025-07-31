"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { menuItems } from "@/data/common/navbar";
import { determineAuthStatus } from "@/lib/auth/authStatus";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await determineAuthStatus();
      setAuth(authStatus);
    };
    checkAuth();
  }, []);

  const handleAuthClick = async () => {
    setMenuOpen(false);
    if (auth) {
      await signOut();
      router.push("/auth/success");
    } else {
      await signIn.social({
        provider: "google",
      });
    }
  };

  const theme = {
    bg: "bg-white",
    text: "text-gray-800",
    hover: "hover:text-blue-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-700",
    buttonText: "text-white",
  };

  return (
    <motion.div
      style={{ y, opacity }}
      className={cn(
        "top-0 z-50 transition-all p-4 duration-300 shadow-sm border-b border-white/50 backdrop-blur-md",
        theme.bg
      )}
    >
      <nav className="w-full flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-xl font-bold text-blue-600"
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
          className={cn("lg:hidden p-2", theme.text)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
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
