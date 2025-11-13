'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserNavbar from "./UserNavbar";
import Container from "./container";
import { FaGraduationCap, FaUsers, FaHandHoldingHeart, FaBookOpen, FaCalendarAlt, FaBriefcase, FaCog } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useUserRole } from "../../hooks/useUserRole";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isHeroSection, setIsHeroSection] = useState<boolean>(true);
  const pathname = usePathname();
  const { userRole } = useUserRole();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
      
      // Détecter si on est sur la section hero (première section de la page d'accueil)
      if (pathname === '/') {
        const heroHeight = window.innerHeight * 0.9; // Approximation de la hauteur du hero
        setIsHeroSection(scrollPosition < heroHeight);
      } else {
        setIsHeroSection(false);
      }
    };

    handleScroll(); // Appel initial
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const navItems: NavItem[] = [
    { name: "Communauté", href: "/communities", icon: <FaUsers className="mr-2 text-sm" /> },
    { name: "Dons", href: "/donations", icon: <FaHandHoldingHeart className="mr-2 text-sm" /> },
    { name: "Histoires", href: "/stories", icon: <FaBookOpen className="mr-2 text-sm" /> },
    { name: "Évènements", href: "/events", icon: <FaCalendarAlt className="mr-2 text-sm" /> },
    { name: "Opportunités", href: "/opportunities", icon: <FaBriefcase className="mr-2 text-sm" /> },
    { name: "Formations", href: "/formations", icon: <FaGraduationCap className="mr-2 text-sm" /> },
  ];

  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  // Classes dynamiques pour le header
  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out
    ${isHeroSection && !isScrolled 
      ? "bg-transparent backdrop-blur-sm py-4 sm:py-6" 
      : isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 py-2 sm:py-3" 
        : "bg-white/90 backdrop-blur-md py-3 sm:py-4"
    }
  `;

  // Classes pour le texte selon le contexte
  const logoTextClasses = isHeroSection && !isScrolled ? "text-white" : "text-red-600";
  const logoSubtextClasses = isHeroSection && !isScrolled ? "text-gray-200" : "text-gray-500";
  const logoSrc = isHeroSection && !isScrolled ? "/Logo%20LAU%20.png" : "/lau/imgi_1_Logo%20LAU-03.png";
  const logoAlt = isHeroSection && !isScrolled
    ? "Leadership Academia University logo monochrome"
    : "Leadership Academia University logo couleurs";

  return (
    <header className={headerClasses}>
      <Container>
        <div className="flex items-center justify-between relative">   
          {/* Logo amélioré */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group relative z-10">
            <motion.div 
              className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                key={logoSrc}
                src={logoSrc} 
                alt={logoAlt}
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </motion.div>
            
            <div className="flex flex-col">
              <motion.span 
                className={`hidden sm:block font-bold text-xl tracking-tight transition-all duration-300 ${logoTextClasses} group-hover:opacity-80`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
              LEADERSHIP ACADEMIA UNIVERSITY
              </motion.span>
              <motion.span 
                className={`text-[10px] sm:text-xs font-medium sm:-mt-1 transition-all duration-300 ${logoSubtextClasses}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Réseau des anciens
              </motion.span>
            </div>
          </Link>

          {/* Navigation Desktop améliorée */}
          <nav className="hidden xl:flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`
                    relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 
                    flex items-center group overflow-hidden
                    ${isActive(item.href)
                      ? isHeroSection && !isScrolled
                        ? "text-white bg-white/20 border border-white/30"
                        : "text-red-600 bg-red-50 border border-red-100"
                      : isHeroSection && !isScrolled
                        ? "text-white/90 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                        : "text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                    }
                  `}
                >
                  <motion.div
                    className="flex items-center relative z-10"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.icon}
                    {item.name}
                  </motion.div>
                  
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${isHeroSection && !isScrolled ? "bg-white" : "bg-red-600"}`}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Partie droite avec UserNavbar et menu mobile */}
          <div className="flex items-center gap-3">
            {/* Lien Admin - visible seulement pour les administrateurs */}
            {userRole?.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="/admin"
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${isHeroSection && !isScrolled
                      ? "text-white bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50"
                      : "text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300"
                    }
                  `}
                  title="Dashboard Administrateur"
                >
                  <FaCog className="mr-1.5 text-sm" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              </motion.div>
            )}
            
            <div className="hidden sm:block">
              <UserNavbar />
            </div>
            
            {/* Bouton menu mobile amélioré */}
            <motion.button
              className={`
                xl:hidden p-3 rounded-xl transition-all duration-300 relative overflow-hidden
                ${isHeroSection && !isScrolled 
                  ? "text-white hover:bg-white/10 border border-white/20 hover:border-white/40" 
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200"
                }
              `}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="w-6 h-6 relative"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 }
                  }}
                  className="absolute h-0.5 w-6 bg-current transform transition-all duration-300 top-1"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="absolute h-0.5 w-6 bg-current transform transition-all duration-300 top-3"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 }
                  }}
                  className="absolute h-0.5 w-6 bg-current transform transition-all duration-300 top-5"
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </Container>

      {/* Menu Mobile amélioré */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl z-50"
            >
              <Container>
                <div className="py-6 space-y-2">
                  
                  {/* UserNavbar pour mobile */}
                  <div className="sm:hidden pb-4 mb-4 border-b border-gray-100">
                    <UserNavbar />
                  </div>

                  {/* Lien Admin pour mobile - visible seulement pour les administrateurs */}
                  {userRole?.role === 'admin' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pb-4 mb-4 border-b border-gray-100"
                    >
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-4 rounded-xl text-base font-medium text-purple-600 bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          className="flex items-center"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <FaCog className="mr-2 text-sm" />
                          Dashboard Admin
                        </motion.div>
                      </Link>
                    </motion.div>
                  )}
                  
                  {/* Navigation Links */}
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`
                          flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-300
                          ${isActive(item.href)
                            ? "text-red-600 bg-red-50 border-l-4 border-red-500"
                            : "text-gray-700 hover:text-red-600 hover:bg-red-50 hover:translate-x-1"
                          }
                        `}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          className="flex items-center"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {item.icon}
                          {item.name}
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 