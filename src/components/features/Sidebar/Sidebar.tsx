// Sidebar.js
import React from 'react';
import SideDisplay from './SideDisplay';
import { Topic } from '@/types/sat-platform/topic';
import { useTopicStore } from '@/store/questions';
import { useAnswerCounterStore, useScoreStore } from '@/store/score';
import { Award, Target } from 'lucide-react';

interface SideBarProps {
    svg: React.ReactElement;
    topics: Topic[];
    title: string;
    handleTopicClick: (topic: Topic) => void;

}

const Sidebar: React.FC<SideBarProps> = ({ svg, title, topics, handleTopicClick}) => {

  const selectedTopic = useTopicStore((state) => state.selectedTopic)
  const score = useScoreStore((state) => state.score);
  const streak = useAnswerCounterStore((state) => state.count)
  
  return (
    <div className="w-full md:w-96 p-5 md:p-10 flex-shrink-0">
      {/* Sidebar Header */}
      <div className="w-full h-14 py-2 cursor-pointer duration-500 hover:bg-gray-50 flex items-center space-x-2">
        <div className="px-2">
          <div className="flex space-x-2 items-center">
            {svg}
            <p className="font-semibold text-2xl">{title}</p>
          </div>
          <p className="uppercase text-[12px] text-gray-400 mt-1">{topics.length} topics</p>
        </div>
      </div>

      {/* Topics List */}
      <div className="mt-5">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`bg-blue-50 py-3 px-3 mb-2 cursor-pointer ${
              selectedTopic?.id === topic.id ? "border-l-4 border-blue-500" : ""
            }`}
            onClick={() => handleTopicClick(topic)}
          >
            <p className="text-[11px] text-gray-400 uppercase">
              {topic.description}
            </p>
            <p className="text-[16px] font-semibold">{topic.name}</p>
          </div>
        ))}
      </div>

      {/* Call-to-Action Sidebars */}
      <div className="flex flex-col space-y-6 mt-16">
        <SideDisplay icon={<Award />} score={score} title="Correct Answers:" />
        <SideDisplay icon={<Target />} score={streak} title="Streak:" />
      </div>
    </div>
  );
};

export default Sidebar;
