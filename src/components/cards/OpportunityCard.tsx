import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPinIcon, CurrencyDollarIcon, CalendarIcon, BuildingOfficeIcon, ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

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

  const getDaysRemaining = (deadline: Date) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(opportunity.deadline);

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
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden group">
        <Image 
          className="object-cover transition-transform duration-300 group-hover:scale-110" 
          fill 
          src={opportunity.imageUrl || "/graduation.jpg"} 
          alt={opportunity.title} 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges en haut */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${getTypeColor(opportunity.type)}`}>
            {opportunity.type}
          </span>
          {daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0 && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white shadow-lg animate-pulse">
              {daysRemaining}j restants
            </span>
          )}
          {daysRemaining !== null && daysRemaining <= 0 && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white shadow-lg">
              Expiré
            </span>
          )}
        </div>

        {/* Overlay hover avec icone */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl"
          >
            <ArrowRightIcon className="h-6 w-6 text-red-600" />
          </motion.div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Entreprise */}
        <div className="flex items-center gap-2 mb-3">
          <BuildingOfficeIcon className="h-5 w-5 text-red-600" />
          <span className="text-red-600 font-semibold text-sm">{opportunity.company}</span>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-red-600 transition-colors">
          {opportunity.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {opportunity.description}
        </p>

        {/* Informations détaillées */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center text-sm text-gray-700">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
            <span className="truncate">{formatSalary(opportunity.salary)}</span>
          </div>
          
          {opportunity.deadline && (
            <div className="flex items-center text-sm text-gray-700">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className="truncate">Échéance: {formatDeadline(opportunity.deadline)}</span>
            </div>
          )}

          {daysRemaining !== null && daysRemaining > 0 && (
            <div className="flex items-center text-sm text-gray-700">
              <ClockIcon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className={`font-medium ${
                daysRemaining <= 3 ? 'text-red-600' : 
                daysRemaining <= 7 ? 'text-orange-600' : 
                'text-green-600'
              }`}>
                {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/opportunities/${opportunity._id}`)}
          className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          Voir les détails
          <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Footer avec metadata */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>ID: {opportunity._id.substring(0, 8)}</span>
          {opportunity.createdAt && (
            <span>
              Publié le {new Date(opportunity.createdAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard; 
