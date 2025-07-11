import React from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import { Libre_Baskerville } from "next/font/google";
import StoryCard from "../../components/cards/StoryCard";
import StoryCardTwo from "../../components/cards/StoryCardTwo";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const stories = [
  {
    title: "Histoire de réussite : Jean Kazunga",
    description:
      "Après avoir obtenu son diplôme en ingénierie informatique à Legacy University, John Doe a fondé sa propre start-up technologique. Grâce aux compétences et aux connaissances acquises pendant ses études, il a réussi à développer une entreprise prospère qui révolutionne l'industrie de la technologie.",
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
  {
    title: "Histoire de carrière internationale : David Muyumba",
    description:
      "Après avoir obtenu son diplôme en commerce international à Legacy University, David Rodriguez a poursuivi une carrière internationale passionnante. Il a travaillé dans différentes entreprises multinationales, parcourant le monde et établissant des partenariats commerciaux fructueux dans divers pays.",
    date: "19 Septembre 2023",
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

const Page = () => {
  return (
    <div>
      <PageTitle
        title={"Des histoires passionnantes"}
        content={"Sur cette page, vivez les histoires des anciens étudiants"}
      />
      <div>
        <div className="max-w-7xl mx-auto pt-8 pb-12">
          <h1 className="text-3xl mb-8">Les Histoires de nos Alumni</h1>
          {/* <div className="grid grid-cols-1 md:grid-cols-2"> */}
          <div className="flex flex-wrap gap-4">
            {stories.map((story, id) => (
              <div key={id}>
                <StoryCardTwo
                  title={story.title}
                  description={story.description}
                  date={story.date}
                  image={story.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
