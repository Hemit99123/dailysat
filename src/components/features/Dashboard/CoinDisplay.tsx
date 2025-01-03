import React from 'react';
import { trend } from '@/types/trend';
import Image from 'next/image';

interface CoinDisplayProps {
    header: string;
    number: number | undefined;
    status: trend;
    percentage: number | undefined;
    type: string;
    icon: string;
    color: string;
}

const StatDisplay: React.FC<CoinDisplayProps> = ({ header, number, status, percentage, type, icon, color }) => {
    return (
        <div className="shadow-lg rounded-lg w-full bg-white p-4">
            <div className="flex items-center mb-3">
                <Image src={`/icons/${icon}.png`} width={40} height={40} alt="hi" />
                <p className={`text-md font-bold text-gray-600 ml-2`}>{header}</p>
            </div>
            <div className='flex items-center'>
                <div>
                    <p className="text-6xl font-bold">
                        <span style={{ color: color }}>{number}</span> <span className="text-xl text-gray-400">{type}</span>
                    </p>

                    {/* The amount changed view render */}
                    <p
                        className={`mt-5 font-semibold ${status == "downward" ? "text-red-500" : "text-green-500"}`}
                    >
                        {status == "downward" ? "-" : "+"}{percentage}% change this week
                    </p>
                </div>
                {type == "coins" && (
                    <button
                        onClick={() => window.location.href = "/cash-out"}
                        className="ml-24 -mt-5 px-10 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Cash Out
                    </button>
                )}
            </div>
        </div>
    );
}

export default StatDisplay;