"use client";

import React, { useState } from "react";
import { FiExternalLink, FiChevronDown } from "react-icons/fi";

interface TeamMember {
  name: string;
  linkedIn: string;
  designation: string;
  src: string;
  quote: string;
}

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <img
        src={member.src}
        alt={member.name}
        className="w-28 h-28 mx-auto rounded-full object-cover"
      />
      <div className="text-center mt-4">
        <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-500">{member.designation}</p>
        <a
          href={member.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 text-sm hover:underline mt-1"
          onClick={(e) => e.stopPropagation()}
        >
          LinkedIn <FiExternalLink className="ml-1" />
        </a>

        {/* Chevron icon indicator */}
        {!expanded && (
          <div className="mt-3 flex justify-center">
            <FiChevronDown className="text-gray-400 text-lg transition-transform duration-300" />
          </div>
        )}

        {/* Expanded quote */}
        {expanded && (
          <p className="mt-4 text-gray-700 text-sm animate-fade-up">{member.quote}</p>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
