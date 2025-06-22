import React from "react";
import { teamMember } from "@/data/team";
import TeamMemberCard from "@/components/features/About/TeamMemberCard";
import "./team.css";

const About = () => {
  const heading = "Our Executives";

  return (
    <div className="px-4">
      <div className="text-center mt-8">
        <h2 className="text-5xl tracking-tight font-extrabold text-blue-900">
          {heading.split("").map((char, index) => (
            <span
              key={index}
              className="fade-in-up inline-block"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
        {teamMember.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

export default About;
