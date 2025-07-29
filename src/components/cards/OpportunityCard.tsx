import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPinIcon, CurrencyDollarIcon, CalendarIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  requirements?: string[];
  deadline: Date;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl: string;
  applicants?: unknown[];
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const router = useRouter();
  
  const formatSalary = (salary: string) => {
    if (!salary || salary === 'Non spécifié') return 'Salaire non spécifié';
    return salary;
  };

  const formatDeadline = (deadline: Date) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cdi':
        return 'bg-green-100 text-green-800';
      case 'cdd':
        return 'bg-yellow-100 text-yellow-800';
      case 'stage':
        return 'bg-blue-100 text-blue-800';
      case 'freelance':
        return 'bg-purple-100 text-purple-800';
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
          src={opportunity.imageUrl || "/graduation.jpg"} 
          alt={opportunity.title} 
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(opportunity.type)}`}>
            {opportunity.type}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {opportunity.title}
        </h3>
        
        <p className="text-blue-600 font-medium mb-2">{opportunity.company}</p>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {opportunity.description}
        </p>

        {/* Informations détaillées */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{opportunity.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>{formatSalary(opportunity.salary)}</span>
          </div>
          
          {opportunity.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>Échéance: {formatDeadline(opportunity.deadline)}</span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.push(`/opportunities/${opportunity._id}`)}
            className="bg-red-800 hover:bg-red-900 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Voir les détails
          </button>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">ID: {opportunity._id.substring(0, 8)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard; 