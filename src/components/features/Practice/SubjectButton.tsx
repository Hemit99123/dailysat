import { ListIcon } from 'lucide-react';
import React from 'react'

interface SubjectButtonProps {
    setSelectedTopic: (arg0: string) => void;
    isActive: boolean;
    subject: string;
}

const SubjectButton: React.FC<SubjectButtonProps> = ({ setSelectedTopic, isActive, subject }) => {
  return (
      <button
        key={subject}
        onClick={() => setSelectedTopic(subject)}
        className={`flex items-center text-left gap-2 rounded border px-3 py-2 text-sm shadow transition-colors ${
          isActive
            ? "border-blue-600 bg-blue-50 text-blue-800"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        }`}
      >
        {subject === "All" ? <ListIcon size={14} /> : null}
        {subject}
      </button>  
    )
}

export default SubjectButton