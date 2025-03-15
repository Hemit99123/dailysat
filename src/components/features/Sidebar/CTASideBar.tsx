"use client";

import React from "react";

interface CTASideBarProps {
    score: number;
    title: string;
}

const CTASideBar: React.FC<CTASideBarProps> = ({ score, title }) => {

    return (
        <>
                <div className="flex flex-col border border-gray-200 rounded-sm px-1.5 py-3 mt-8">
                    <div className="flex items-center mb-0.5">
                        <p className="font-medium uppercase text-[12px]">{title}</p>
                    </div>
                    <div>
                        {score}
                    </div>
                </div>
        </>
    );
};

export default CTASideBar;
