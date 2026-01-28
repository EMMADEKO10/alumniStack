'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaUniversity, FaQuoteLeft } from "react-icons/fa";

const About: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full w-fit border border-red-100 uppercase tracking-widest text-xs font-bold">
                <FaUniversity />
                <span>Notre Héritage</span>
              </div>

              <h2 className="typography-heading-1 text-slate-900 leading-tight">
                L&apos;excellence académique au service de la 
                <span className="block bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent italic">
                  communauté mondiale
                </span>
              </h2>

              <p className="typography-body text-slate-600 leading-relaxed md:text-xl">
                La <span className="font-bold text-slate-900">Leadership Academia University Alumni Association</span> n&apos;est pas seulement un annuaire de diplômés. C&apos;est un écosystème vivant qui propulse ses membres vers de nouveaux sommets.
              </p>
              
              <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-red-600 italic text-slate-700 relative">
                <FaQuoteLeft className="absolute top-4 right-4 text-slate-200 text-4xl -z-10" />
                <p className="relative z-10">
                  &quot;Notre mission est de cultiver l&apos;esprit de leadership et d&apos;innovation qui a défini votre passage à la LAU, en créant des ponts entre les générations de leaders.&quot;
                </p>
              </div>

              <p className="typography-body text-slate-600 leading-relaxed">
                Avec une présence dans plus de <span className="text-red-600 font-bold">150 pays</span>, nous formons un réseau puissant de près de <span className="text-red-600 font-bold mx-1">100 000 membres</span> unis par les mêmes valeurs d&apos;excellence et d&apos;intégrité.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-none font-bold typography-body hover:bg-red-700 transition-all duration-300 shadow-xl hover:shadow-red-500/20 group"
              >
                <span>Notre Vision 2030</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative h-125 lg:h-150 w-full rounded-none overflow-hidden shadow-2xl">
              <Image
                src="/graduation.jpg"
                alt="Graduation LAU"
                fill
                className="object-cover hover:scale-105 transition-transform duration-[5s]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-white p-8 rounded-none shadow-2xl border border-slate-100 hidden md:block max-w-xs"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <FaUniversity className="text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Top 1%</div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Classement Mondial</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-snug">
                Reconnue pour la qualité de son réseau et l&apos;employabilité de ses diplômés.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 
