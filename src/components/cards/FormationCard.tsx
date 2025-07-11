import Image from "next/image";
import { 
  AcademicCapIcon, 
  MapPinIcon, 
  CalendarIcon,
  ClockIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

interface Formation {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  price: number;
  startDate: Date;
  endDate: Date;
  location: string;
  maxStudents?: number;
  imageUrl: string;
  createdAt: Date;
}

interface FormationCardProps {
  formation: Formation;
}

const FormationCard: React.FC<FormationCardProps> = ({ formation }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'débutant':
        return 'bg-green-100 text-green-800';
      case 'intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image 
          className="object-cover" 
          fill 
          src={formation.imageUrl || "/graduation.jpg"} 
          alt={formation.title} 
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(formation.level)}`}>
            {formation.level}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-red-800 text-white px-2 py-1 text-sm font-medium rounded">
            {formatPrice(formation.price)}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {formation.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {formation.description}
        </p>

        {/* Informations détaillées */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <AcademicCapIcon className="h-4 w-4 mr-2" />
            <span>{formation.instructor}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{formation.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>{formation.duration}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Du {formatDate(formation.startDate)} au {formatDate(formation.endDate)}</span>
          </div>
          
          {formation.maxStudents && (
            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              <span>Max {formation.maxStudents} participants</span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="flex justify-between items-center">
          <button className="bg-red-800 hover:bg-red-900 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Voir les détails
          </button>
          
          <div className="text-right">
            <p className="text-lg font-bold text-red-800">
              {formatPrice(formation.price)}
            </p>
            <p className="text-xs text-gray-500">Prix total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationCard; 