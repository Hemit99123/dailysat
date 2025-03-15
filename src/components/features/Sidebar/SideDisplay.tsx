"use client";

import React from "react";

interface SideDisplayProps {
    score: number;
    title: string;
    icon: React.ReactNode;
}

const SideDisplay: React.FC<SideDisplayProps> = ({ icon, score, title }) => {

    return (
        <div className="rounded-lg shadow-md border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-lg group">
        <div className="bg-blue-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold uppercase text-sm tracking-wide">{title}</h3>
            {icon}
          </div>
        </div>
  
        <div className="px-4 py-3">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-blue-500">{score}</span>
          </div>
        </div>
      </div>
    );
};

export default SideDisplay;
