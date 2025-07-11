"use client";
import React from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import FormationSection from "./FormationSection";

const Page: React.FC = () => {
  return (
    <div>
      <PageTitle
        title={"Les formations"}
        content={
          "Nous vous proposons plusieurs formations pour vous aider à vous améliorer"
        }
      />
      <FormationSection />
    </div>
  );
};

export default Page; 