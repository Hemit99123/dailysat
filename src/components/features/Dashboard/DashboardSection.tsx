import React from 'react';

interface DashboardSectionProps {
  title: string;
  icon?: React.ReactNode | string;
  children: React.ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  title, 
  icon, 
  children 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center space-x-2">
        {icon && <span className="text-xl">{icon}</span>}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default DashboardSection; 