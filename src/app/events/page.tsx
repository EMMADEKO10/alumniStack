import React from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import EventSection from "./EventSection";

const Page: React.FC = () => {
  return (
    <div>
      <PageTitle
        title={"Les Evènements"}
        content={
          "Rejoignez la communauté mondiale des anciens élèves de l'Université de Kinshasa, où que vous soyez (sur le campus, en ligne et dans votre région), à travers des programmes et des événements."
        }
      />
      <EventSection />
    </div>
  );
};

export default Page; 