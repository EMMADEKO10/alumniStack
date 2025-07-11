import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="h-[80vh] relative">
      <div className="w-full h-full relative">
        <Image
          src="/graduation.jpg"
          alt="background image"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
        <div className="border-red-500 w-1/2 h-1/2 flex flex-col gap-8">
          <h1
            className="text-white text-5xl font-semibold"
            style={{ lineHeight: "3rem" }}
          >
            Bienvenue sur le site des <br />
            <span className="text-red-800 font-semibold">Alumni</span> <br />
            de l&apos;université Legacy
          </h1>
          <p className="text-xl text-white leading-7">
            Nous formons une très grande communauté, <br /> et nous sommes unis
            pour notre alma mater
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero; 