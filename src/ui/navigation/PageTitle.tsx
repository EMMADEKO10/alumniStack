import Image from "next/image";
import React from "react";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface PageTitleProps {
  title: string;
  content: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, content }) => {
  return (
    <div className="relative h-[40vh] min-h-[300px] max-h-[500px]">
      {/* Image de fond */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/graduation.jpg"
          alt="background image"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Contenu */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className={`${libreBaskerville.className} text-center max-w-4xl mx-auto`}>
          <h1 className="text-white text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-white text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageTitle; 