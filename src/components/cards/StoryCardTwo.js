import Image from "next/image";
const StoryCardTwo = ({ title, description, image, category, date }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg ">
      <div className="relative h-48 w-full">
        <Image className="object-cover" fill src={image} alt={title} />
      </div>
      <div className="px-6 py-4">
        {/* <p className="mb-2 bg-red-500 text-white inline-block p-1 text-sm rounded-md">
          {category}
        </p> */}
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base overflow-hidden line-clamp-3">
          {description}
        </p>
        <p className="mt-2 italic text-gray-400">{date}</p>
      </div>

      <div className="px-6 py-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Lire plus
        </button>
      </div>
    </div>
  );
};

export default StoryCardTwo;
