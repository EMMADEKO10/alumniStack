// Removed Libre_Baskerville import and configuration - using default sans-serif fonts

const CommunityCard = ({ day, month, category, place, time, event }) => {
  return (
    <div className="flex gap-3 hover:cursor-pointer">
      <div className="flex flex-col gap-2">
        <p className="uppercase">{month}</p>
        <p>{day}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p>{category}</p>
        <p className="text-xl font-sans">
          {event} | de {time}
        </p>
        <p className="text-base mt-1">{place}</p>
      </div>
    </div>
  );
};

export default CommunityCard;
