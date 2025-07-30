"use client";

import { Badge } from "@/components/common/Badge"
import { motion } from "framer-motion";

interface FeatureItemProps {
  badgeText: string;
  title: string;
  description: string;
  toolTip1: string;
  toolTip2: string;
  flip?: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  badgeText,
  title,
  description,
  toolTip1,
  toolTip2,
  flip = false,
}) => {
  return (
    <div className={`flex items-center justify-between text-blue-900 rounded-2xl px-10 py-14 ${flip ? 'flex-row-reverse' : ''}`}>
        <motion.div
            className="w-1/2 flex items-center justify-center bg-blue-50 rounded-2xl py-10 px-10 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
        >
            <img 
                src="/assets/ace-sat.png" 
                alt="Workflow Automation UI" 
                className="rounded-2xl w-full max-w-md object-contain"
            />
        </motion.div>


      <div className={`w-1/2 ${flip ? 'pr-10' : 'pl-10'}`}>
        <Badge className="flex items-center justify-center px-4 py-1.5 w-40 bg-blue-100 text-blue-700 border-blue-100 rounded-lg mb-4 hover:bg-blue-200 duration-300">
        {badgeText}
        </Badge>

        <h3 className="text-4xl font-semibold mb-4">
          {title}
        </h3>

        <p className="text-gray-500 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex space-x-4">
          <div className="border border-blue-100 rounded-lg py-2 px-4 text-sm text-center">
            {toolTip1}
          </div>
          <div className="border border-blue-100 rounded-lg py-2 px-4 text-sm text-center">
            {toolTip2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;
