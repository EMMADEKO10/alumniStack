"use client";
import React from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import OpportunitySection from "./OpportunitySection";

const Page: React.FC = () => {
  return (
    <div>
      <PageTitle
        title={"Les opportunités"}
        content={
          "Quelle que soit l'étape de votre carrière dans laquelle vous vous trouvez, la Harvard Alumni Association a des ressources pour vous. Des services à l'échelle de l'université et spécifiques à l'école aux informations sur les événements de réseautage et les webinaires en ligne, nous avons compilé certaines des meilleures ressources et services liés à la carrière de Harvard, et tout est à portée de main."
        }
      />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {/* <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test de la page</h2>
          <p className="text-gray-600">Si vous voyez ce message, la page de base fonctionne.</p>
        </div> */}
        <OpportunitySection />
      </div>
    </div>
  );
};

export default Page; 