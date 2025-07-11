"use client";
import React from "react";
import PageTitle from "../../ui/navigation/PageTitle";

const SimplePage = () => {
  return (
    <div>
      <PageTitle
        title={"Les opportunités"}
        content={
          "Quelle que soit l'étape de votre carrière dans laquelle vous vous trouvez, la Harvard Alumni Association a des ressources pour vous."
        }
      />
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page des opportunités</h2>
          <p className="text-gray-600">Cette page fonctionne correctement !</p>
        </div>
      </div>
    </div>
  );
};

export default SimplePage; 