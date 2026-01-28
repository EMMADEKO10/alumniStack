import React from "react";
// Removed Libre_Baskerville import - using default sans-serif fonts
import { CalendarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

// Removed Libre_Baskerville configuration

interface EventCardProps {
  day: string;
  month: string;
  category: string;
  place: string;
  time: string;
  event: string;
  imageUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  day, 
  month, 
  category, 
  place, 
  time, 
  event, 
  imageUrl 
}) => {
  return (
    <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer group">
      {/* Date Section */}
      <div className="shrink-0 text-center">
        <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-lg p-3 shadow-sm group-hover:shadow-md transition-shadow">
          <p className="text-xs font-medium uppercase tracking-wide">{month}</p>
          <p className="text-2xl font-bold leading-none">{day}</p>
        </div>
      </div>

      {/* Image Section */}
      <div className="shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="96px"
              priority={false}
              unoptimized={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CalendarIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category}
          </span>
        </div>

        {/* Event Title */}
        <h3 className={`font-sans text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors`}>
          {event}
        </h3>

        {/* Event Details */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{place}</span>
          </div>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="shrink-0 flex items-center">
        <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
};

export default EventCard; 
