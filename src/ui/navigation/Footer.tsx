"use client";

import React from "react";
import Container from "./container";
import Link from "next/link";
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import dynamic from 'next/dynamic';

const Newsletter = dynamic(() => import('../Newsletter'), {
  ssr: false,
  loading: () => (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">Restez informé de nos actualités</p>
      <div className="flex space-x-2">
        <div className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg animate-pulse h-10"></div>
        <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg animate-pulse w-12 h-10"></div>
      </div>
    </div>
  )
});

interface NavigationItem {
  name: string;
  link: string;
}

interface SocialIconProps {
  size?: number;
}

const Footer: React.FC = () => {
  const navigation: NavigationItem[] = [
    { name: "Accueil", link: "" },
    { name: "Histoires", link: "stories" },
    { name: "Évènements", link: "events" },
    { name: "Formations", link: "formations" },
  ];

  const services: NavigationItem[] = [
    { name: "Dons", link: "donations" },
    { name: "Opportunités", link: "opportunities" },
    { name: "Communauté", link: "community" },
    { name: "Profil", link: "profile" },
  ];
  
  const legal: NavigationItem[] = [
    { name: "Politique de confidentialité", link: "politique-de-confidentialite" },
    { name: "Conditions d'utilisation", link: "conditions" },
    { name: "FAQ", link: "faq" },
    { name: "Contact", link: "contact" },
  ];
  
  return (
    <footer className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container>
        <div className="relative z-10 pt-10 pb-6">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand section */}
            <div className="lg:col-span-1 space-y-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="p-3 bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-300 group-hover:scale-105">
                  <FaGraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    LAU Alumni
                  </h3>
                  <p className="text-sm text-gray-400">Platform</p>
                </div>
              </Link>
              
              <p className="text-gray-300 leading-relaxed">
                La plateforme officielle des anciens étudiants de Leadership Academia University. 
                Connectez-vous, grandissez et construisez ensemble l&apos;avenir.
              </p>

              {/* Stats */}
              {/* <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-xl font-bold text-red-400">100K+</div>
                  <div className="text-xs text-gray-400">Alumni</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-xl font-bold text-blue-400">50+</div> 
                  <div className="text-xs text-gray-400">Pays</div>
                </div>
              </div> */}
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold bg-linear-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                Navigation
              </h4>
              <nav className="space-y-3">
                {navigation.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${item.link}`}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                Services
              </h4>
              <nav className="space-y-3">
                {services.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${item.link}`}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold bg-linear-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                Restons connectés
              </h4>
              
              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaEnvelope className="w-4 h-4 text-red-400" />
                  <span className="text-sm">contact@lau-alumni.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaPhone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">+243 821 355 601</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <FaMapMarkerAlt className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Kinshasa, RDC</span>
                </div>
              </div>

              {/* Newsletter */}
              <Newsletter />
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
            <div className="mb-6 md:mb-0">
              <h5 className="text-sm font-medium text-gray-300 mb-3">Suivez-nous</h5>
              <div className="flex space-x-4">
                <SocialLink href="https://twitter.com/lau_alumni" icon={<Twitter />} />
                <SocialLink href="https://facebook.com/lau.alumni" icon={<Facebook />} />
                <SocialLink href="https://instagram.com/lau_alumni" icon={<Instagram />} />
                <SocialLink href="https://linkedin.com/company/lau-alumni" icon={<Linkedin />} />
              </div>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              {legal.map((item, index) => (
                <Link
                  key={index}
                  href={`/${item.link}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center space-x-2">
              <span>© {new Date().getFullYear()} LAU Alumni Platform.</span>
              <span>Fait avec</span>
              {/* <FaHeart className="w-4 h-4 text-red-400 animate-pulse" /> */}
              <span>par</span>
              <a
                href="https://al-legacy.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold bg-linear-to-r from-red-400 to-blue-400 bg-clip-text text-transparent hover:from-red-500 hover:to-blue-500 transition-all duration-200"
              >
                Al & Legacy Team
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

// Social Link Component
const SocialLink: React.FC<{ href: string; icon: React.ReactNode }> = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm group"
  >
    <div className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200">
      {icon}
    </div>
  </a>
);

export default Footer;

const Twitter: React.FC<SocialIconProps> = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 4.37a9.6 9.6 0 0 1-2.83.8 5.04 5.04 0 0 0 2.17-2.8c-.95.58-2 1-3.13 1.22A4.86 4.86 0 0 0 16.61 2a4.99 4.99 0 0 0-4.79 6.2A13.87 13.87 0 0 1 1.67 2.92 5.12 5.12 0 0 0 3.2 9.67a4.82 4.82 0 0 1-2.23-.64v.07c0 2.44 1.7 4.48 3.95 4.95a4.84 4.84 0 0 1-2.22.08c.63 2.01 2.45 3.47 4.6 3.51A9.72 9.72 0 0 1 0 19.74 13.68 13.68 0 0 0 7.55 22c9.06 0 14-7.7 14-14.37v-.65c.96-.71 1.79-1.6 2.45-2.61z" />
  </svg>
);

const Facebook: React.FC<SocialIconProps> = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);

const Instagram: React.FC<SocialIconProps> = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.98 0a6.9 6.9 0 0 1 5.08 1.98A6.94 6.94 0 0 1 24 7.02v9.96c0 2.08-.68 3.87-1.98 5.13A7.14 7.14 0 0 1 16.94 24H7.06a7.06 7.06 0 0 1-5.03-1.89A6.96 6.96 0 0 1 0 16.94V7.02C0 2.8 2.8 0 7.02 0h9.96zm.05 2.23H7.06c-1.45 0-2.7.43-3.53 1.25a4.82 4.82 0 0 0-1.3 3.54v9.92c0 1.5.43 2.7 1.3 3.58a5 5 0 0 0 3.53 1.25h9.88a5 5 0 0 0 3.53-1.25 4.73 4.73 0 0 0 1.4-3.54V7.02a5 5 0 0 0-1.3-3.49 4.82 4.82 0 0 0-3.54-1.3zM12 5.76c3.39 0 6.2 2.8 6.2 6.2a6.2 6.2 0 0 1-12.4 0 6.2 6.2 0 0 1 6.2-6.2zm0 2.22a3.99 3.99 0 0 0-3.97 3.97A3.99 3.99 0 0 0 12 15.92a3.99 3.99 0 0 0 3.97-3.97A3.99 3.99 0 0 0 12 7.98zm6.44-3.77a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z" />
  </svg>
);

const Linkedin: React.FC<SocialIconProps> = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
  </svg>
); 
