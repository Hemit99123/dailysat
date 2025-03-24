import React from "react";
import { AnimatedTeamCard } from "@/components/features/About/AnimatedTeamCard";
import "./team.css";
import { teamMember } from "@/data/team";

const About = () => {
  const text = "Our Executives";
  const subText = "These are the people behind DailySAT!";
  

  return (
    <div>
      <div className="text-center mt-8">
        <h2 className="text-5xl tracking-tight font-extrabold text-blue-900">
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="fade-in-up inline-block"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {char === " " ? "\u00A0" : char} {/* Preserve spaces */}
            </span>
          ))}
        </h2>
        <p className="font-light text-blue-900 sm:text-xl mt-2">
          {subText.split("").map((char, index) => (
            <span
              key={index}
              className="fade-in-up inline-block"
              style={{ animationDelay: `${index * 25}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      </div>
      <AnimatedTeamCard testimonials={teamMember} />
    </div>
  );
};

export default About;
