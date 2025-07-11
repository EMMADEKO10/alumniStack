import Image from "next/image";
import Hero from "../ui/Hero";
import Link from "next/link";
import Contribute from "../ui/Contribute";
import Events from "../ui/Events";
import About from "../ui/About";

export default function Home() {
  return (
    <main className="">
      <Hero />
      <Contribute />
      <Events />
      <About />
    </main>
  );
}
