import Image from "next/image";
import Link from "next/link";
// Removed Libre_Baskerville import - using default sans-serif fonts

// Removed Libre_Baskerville configuration

const Contribute: React.FC = () => {
  return (
    <section className="py-8 bg-red-800 text-white">
      <div className="max-w-7xl mx-auto h-[50vh] flex justify-center">
        <div className="relative h-full w-1/2">
          <Image
            src="/graduation.jpg"
            alt="graduation"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-1/2 p-4 px-8 flex flex-col gap-8">
          <h2 className={`text-4xl font-sans w-3/4`}>
            Participer à l&apos;évolution de notre université
          </h2>
          <p>
            Votre aide est très importante pour aider à encourager les
            différents projets et permettre l&apos;avancement de notre
            université
          </p>
          <div>
            <Link
              href={"/donations"}
              className="border p-2 px-4 rounded-md hover:bg-red-700 hover:text-white"
            >
              Donner
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contribute; 
