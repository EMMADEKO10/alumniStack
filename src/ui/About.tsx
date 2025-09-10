import Image from "next/image";
import Link from "next/link";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const About: React.FC = () => {
  return (
    <section className="p-4 py-16 bg-white">
      <div className="max-w-7xl h-[40vh] mx-auto grid grid-cols-1 lg:grid-cols-2">
        <div className="w-full p-4 px-8 flex flex-col gap-8">
          <h2
            className={`text-4xl ${libreBaskerville.className} w-3/4`}
            style={{ lineHeight: "3rem" }}
          >
            A propos des Alumni de Leadership AcademiaUniversity (LAU)
          </h2>
          <p>
            La <span className="font-semibold">Leadership AcademiaUniversity Alumni Association</span>{" "}
            est l&apos;association officielle des anciens étudiants de la Leadership AcademiaUniversity (LAU)
            qui comprend près de{" "}
            <span className="italic font-semibold">100000 membres</span> dans le
            monde entier
          </p>
          <div>
            <Link
              href={"/about"}
              className="border p-2 px-4 rounded-md bg-red-800 hover:bg-red-900 text-white"
            >
              En savoir plus
            </Link>
          </div>
        </div>
        <div className="relative h-full w-full">
          <Image
            src="/graduation.jpg"
            alt="graduation"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About; 