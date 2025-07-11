import EventForm from '../../../../components/forms/EventForm';
import Link from 'next/link';

export default function AddEventPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/admin/events"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            &larr; Retour à la gestion des événements
          </Link>
        </div>
        <EventForm />
      </div>
    </div>
  );
} 