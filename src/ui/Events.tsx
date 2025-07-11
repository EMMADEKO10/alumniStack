import Link from "next/link";
import EventCard from "../components/cards/EventCard";
import { Libre_Baskerville } from "next/font/google";
import StoryCard from "../components/cards/StoryCard";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface Story {
  title: string;
  description: string;
  date: string;
  image: string;
}

interface Event {
  day: string;
  month: string;
  year: string;
  category: string;
  place: string;
  time: string;
  event: string;
}

const stories: Story[] = [
  {
    title: "Histoire de réussite : Jean Kazunga",
    description:
      "Après avoir obtenu son diplôme en ingénierie informatique à Legacy University, Jean Kazunga a fondé sa propre start-up technologique. Grâce aux compétences et aux connaissances acquises pendant ses études, il a réussi à développer une entreprise prospère qui révolutionne l'industrie de la technologie.",
    date: "5 mars 2023",
    image: "/graduation.jpg",
  },
  {
    title: "Une Histoire inspirante : Olga Mujinga",
    description:
      "Olga Mujinga, diplômée en administration des affaires de Legacy University, a surmonté de nombreux obstacles pour atteindre le succès. Malgré des débuts modestes, elle a utilisé les compétences en leadership et en gestion qu'elle a acquises à l'université pour gravir les échelons et devenir PDG d'une grande entreprise internationale.",
    date: "12 Avril 2023",
    image: "/graduation.jpg",
  },
  {
    title: "Histoire de carrière internationale : David Muyumba",
    description:
      "Après avoir obtenu son diplôme en commerce international à Legacy University, David Rodriguez a poursuivi une carrière internationale passionnante. Il a travaillé dans différentes entreprises multinationales, parcourant le monde et établissant des partenariats commerciaux fructueux dans divers pays.",
    date: "19 Septembre 2023",
    image: "/graduation.jpg",
  },
];

const events: Event[] = [
  {
    day: "15",
    month: "janvier",
    year: "2024",
    category: "Salon de l'emploi",
    place: "Centre des congrès Legacy",
    time: "10h00 - 16h00",
    event: "Salon de l'emploi : Trouvez votre carrière idéale",
  },
  {
    day: "21",
    month: "janvier",
    year: "2024",
    category: "Exposition d'art contemporain",
    place: "Centre de conférences Legacy",
    time: "10h00 - 18h00",
    event:
      "Exposition d'art contemporain : Exploration des formes et des couleurs",
  },
  {
    day: "28",
    month: "janvier",
    year: "2024",
    category: "Séminaire de développement personnel",
    place: "Fleuve Congo Hôtel",
    time: "14h00 - 17h00",
    event:
      "Séminaire de développement personnel : Réalisez votre plein potentiel",
  },
];

const Events: React.FC = () => {
  return (
    <section className="bg-gray-100 p-4 py-16 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 pr-3">
          <h2 className={`${libreBaskerville.className} text-3xl mb-4`}>
            Quelques histoires
          </h2>
          <div className="flex flex-col gap-6">
            {stories.map((story, id) => (
              <StoryCard
                key={id}
                title={story.title}
                description={story.description}
                date={story.date}
              />
            ))}
          </div>
          <div className="mt-3">
            <Link href="/events">
              <button className="py-2 px-4 bg-red-800 text-white hover:bg-red-900 rounded-md">
                Voir toutes les histoires
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8 md:mt-0">
          <h2 className={`${libreBaskerville.className} text-3xl mb-4`}>
            Programmes et Evènements
          </h2>
          <div className="pl-3 flex flex-col gap-8">
            {events.map((event, id) => (
              <EventCard
                category={event.category}
                place={event.place}
                time={event.time}
                event={event.event}
                day={event.day}
                month={event.month}
                key={id}
              />
            ))}
          </div>
          <div className="mt-3 pl-3">
            <Link href="/events">
              <button className="py-2 px-4 bg-red-800 text-white hover:bg-red-900 rounded-md">
                Voir tous les évènements
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events; 