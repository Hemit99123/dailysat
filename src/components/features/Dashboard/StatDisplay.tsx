import React from 'react';
import Image from 'next/image';

interface CoinDisplayProps {
    header: string;
    number: number | undefined;
    type: string;
    icon: string;
    color: string;
}

const StatDisplay: React.FC<CoinDisplayProps> = ({ header, number, type, icon, color }) => {
    return (
        <div className="shadow-lg rounded-lg w-full bg-white p-4">
            <div className="flex items-center mb-3">
                <Image src={`/icons/${icon}.png`} width={40} height={40} alt="hi" />
                <p className={`text-md font-bold text-gray-600 ml-2`}>{header}</p>
            </div>
            <div className='flex items-center mb-5'>
                <div>
                    <p className="text-6xl font-bold">
                        <span style={{ color: color }}>{number || 0}</span> <span className="text-xl text-gray-400">{type}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StatDisplay;