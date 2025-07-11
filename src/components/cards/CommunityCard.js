import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const CommunityCard = ({ day, month, category, place, time, event }) => {
  return (
    <div className="flex gap-3 hover:cursor-pointer">
      <div className="flex flex-col gap-2">
        <p className="uppercase">{month}</p>
        <p>{day}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p>{category}</p>
        <p className={`${libreBaskerville.className} text-xl`}>
          {event} | de {time}
        </p>
        <p className="text-base mt-1">{place}</p>
      </div>
    </div>
  );
};

export default CommunityCard;
