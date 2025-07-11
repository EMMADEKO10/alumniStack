import Image from "next/image";
import React from "react";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const StoryCard = ({ title, description, date }) => {
  return (
    <div className="flex flex-row border">
      <div className="h-full w-1/3 relative">
        <Image
          src="/graduation.jpg"
          alt="Image histoire"
          fill
          className="object-cover"
        />
      </div>
      <div className="pl-3 w-2/3 flex flex-col gap-3 py-2 pr-1">
        <p>{date}</p>
        <p className={`${libreBaskerville.className} text-xl`}>{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default StoryCard;
