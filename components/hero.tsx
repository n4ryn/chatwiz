import { personaData } from "@/libs/persona";
import React from "react";
import PersonaCard from "./persona-card";

const Hero = () => {
  return (
    <section className="w-full h-auto">
      <main className="lg:px-5">
        <div
          className="overflow-hidden px-5 pt-32 mx-auto max-w-7xl lg:rounded-4xl lg:my-5 lg:px-0"
          style={{
            background:
              "linear-gradient(165deg, #f2f2f2 30%, #f9d8ad 40%, #f1a9d3 60%, #f0d1fc 70%, #fbd2e2 80%, #e3f1fd 100%)",
          }}
        >
          <div className="mb-12 text-left md:text-center">
            <p className="inline-block px-3 py-1.5 mx-auto mb-4 text-xs font-semibold tracking-wide text-gray-600 uppercase rounded-full bg-white/60">
              ⚡️AI-Powered Persona Chat Experience
            </p>
            <h1 className="mx-auto mb-6 max-w-3xl text-3xl font-normal tracking-tight leading-tight text-gray-900 text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Build Stronger Relationships, One Message at a Time
            </h1>
            <p className="mx-auto mb-8 text-lg leading-relaxed text-gray-600 md:max-w-lg md:text-xl">
              Bridge the gap between support and service with conversations that
              build loyalty from day one.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            {personaData.map((persona) => (
              <PersonaCard data={persona} key={persona.id}></PersonaCard>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
};

export default Hero;
