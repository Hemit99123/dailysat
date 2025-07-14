import React from 'react';
import { useRouter } from 'next/navigation';
import { redirectionRoutesType } from "@/types/dashboard/option-redirect-routes"

interface OptionProps {
  icon: React.ReactNode; // Use React.ReactNode for flexibility on what jsx can be passed
  header: string;
  redirect: redirectionRoutesType;
}

const Option: React.FC<OptionProps> = ({ icon, header, redirect }) => {
  const router = useRouter()
  
  const handleRedirect = () => {
      router.push(redirect)
  }
  return (
    <div 
        className="flex border p-4 rounded-lg hover:shadow-sm transition-shadow space-x-4 cursor-pointer"
        onClick={handleRedirect} 
    >
      <div className="icon">{icon}</div>
      <div>
        <h1 className="text-lg text-gray-600 font-semibold">{header}</h1>
      </div>
    </div>
  );
};

export default Option;