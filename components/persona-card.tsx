import Image from "next/image";
import Link from "next/link";

import { Persona } from "@/types";

const PersonaCard = ({ data }: { data: Persona }) => {
  const {
    name,
    twitterHandle,
    avatar,
    cover,
    tagline,
    description,
    reach,
    expertise,
    id,
  } = data;

  return (
    <div className="relative md:max-w-sm overflow-hidden bg-white border rounded-lg shadow-sm border-neutral-200/60 mb-4 hover:shadow-xl/20 hover:shadow-pink-400 hover:-translate-y-1 transition-all duration-300">
      <Image
        alt={`${name} cover`}
        width={400}
        height={400}
        src={cover}
        className="relative z-20 object-cover w-full h-32"
      />
      <div className="absolute top-0 z-50 flex items-center w-full mt-2 translate-y-24 px-7 -translate-x-0">
        <div className="w-20 h-20 p-1 bg-white rounded-full">
          <div className="avatar avatar-online">
            <div className="w-18 rounded-full">
              <Image
                alt={`${name} avatar`}
                width={400}
                height={400}
                src={avatar}
                className="w-full h-full rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="block mt-6 ml-2">
          <h5 className="text-md font-bold leading-none tracking-tight text-neutral-900">
            {name}
          </h5>
          <small className="block mt-1 text-xs font-medium leading-none text-neutral-500">
            {twitterHandle}
          </small>
        </div>
        <button className="absolute transition-all duration-200 right-0 inline-flex items-center justify-center w-auto px-5 mt-6 text-sm font-medium rounded-full h-9 mr-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-neutral-900 disabled:pointer-events-none hover:bg-white hover:text-black hover:border-2 hover:border-black hover:shadow-md/40 text-neutral-100">
          <Link href={`/chat/${id}`}>Chat</Link>
        </button>
      </div>
      <div className="relative pb-6 p-7">
        <p className="mt-12 mb-6 text-black font-semibold text-sm text-center">
          {tagline}
        </p>

        <p className="my-6 text-neutral-600 font-light text-sm">
          {description}
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {expertise.map((skill, index) => (
            <div
              className="bg-pink-400/20 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                background:
                  "linear-gradient(165deg, #f2f2f2 10%, #f9d8ad 60%, #f1a9d3 90%)",
              }}
              key={index}
            >
              {skill}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center text-center justify-between pr-2 text-neutral-500">
          <div>
            <p className="text-sm font-bold text-black">{reach.youtube}</p>
            <p className="text-xs">Youtube Subscribers</p>
          </div>
          <div>
            <p className="text-sm font-bold text-black">{reach.udemy}</p>
            <p className="text-xs">Udemy learners</p>
          </div>
          <div>
            <p className="text-sm font-bold text-black">{reach.reviews}</p>
            <p className="text-xs">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaCard;
