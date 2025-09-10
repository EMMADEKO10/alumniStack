import React from "react";
import PageTitle from "../../ui/navigation/PageTitle";
import CommunityCard from "../../components/cards/CommunityCard";

const events = [
  {
    day: "15 ",
    month: "janvier",
    year: "2023",
    category: "Tous",
    place: "Gombe",
    time: "35",
    event: "Alumni Kinshasa",
  },
  {
    day: "8",
    month: "juillet",
    year: "2023",
    category: "Tous",
    place: "Lubumbashi",
    time: "20",
    event: "Alumni Haut-Katanga",
  },
  {
    day: "15",
    month: "janvier",
    year: "2024",
    category: "Economie",
    place: "Kinshasa",
    time: "46",
    event: "Anciens étudiants de l'économie",
  },
  {
    day: "21",
    month: "janvier",
    year: "2024",
    category: "Ingénieur",
    place: "RDC",
    time: "543",
    event: "Les ingénieurs de Leadership AcademiaUniversity (LAU)",
  },
  {
    day: "15  ",
    month: "janvier",
    year: "2023",
    category: "Medecine",
    place: "Kikwit",
    time: "330",
    event: "Les medecins de Leadership AcademiaUniversity (LAU)",
  },
];

const Page = () => {
  return (
    <div>
      <PageTitle
        title={"Notre communauté"}
        content={
          "Alumni Leadership AcademiaUniversity (LAU) est une très grande communauté regroupant tous les anciens de Leadership AcademiaUniversity (LAU)"
        }
      />
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="mt-8 flex flex-col gap-5">
            {events.map((event, id) => (
              <div key={id}>
                {" "}
                <CommunityCard
                  event={event.event}
                  place={event.place}
                  day={event.day}
                  month={event.month}
                  category={event.category}
                  time={event.time}
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
