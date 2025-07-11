'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserNavbar from "./UserNavbar";
import Container from "./container";
import { FaGraduationCap, FaUsers, FaHandHoldingHeart, FaBookOpen, FaCalendarAlt, FaBriefcase, FaGraduationCap as FaGraduation } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Header = (): JSX.Element => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems: NavItem[] = [
    { name: "Communauté", href: "/community", icon: <FaUsers className="mr-2" /> },
    { name: "Dons", href: "/donations", icon: <FaHandHoldingHeart className="mr-2" /> },
    { name: "Histoires", href: "/stories", icon: <FaBookOpen className="mr-2" /> },
    { name: "Evènements", href: "/events", icon: <FaCalendarAlt className="mr-2" /> },
    { name: "Opportunités", href: "/opportunities", icon: <FaBriefcase className="mr-2" /> },
    { name: "Formations", href: "/formations", icon: <FaGraduation className="mr-2" /> },
  ];

  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-md py-2" 
          : "bg-white/80 backdrop-blur-md py-4"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-10 h-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-lg transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <FaGraduationCap className="text-2xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-red-600 font-bold text-xl tracking-tight group-hover:text-red-700 transition-colors">LEGACY ALUMNI</span>
              <span className="text-gray-500 text-xs font-medium -mt-1">Réseau des anciens</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                  isActive(item.href)
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <UserNavbar />
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <Container>
              <nav className="flex flex-col py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-md text-sm font-medium flex items-center ${
                      isActive(item.href)
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:text-red-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 