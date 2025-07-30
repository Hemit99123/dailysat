"use client";

import { Badge } from "@/components/common/Badge";
import { motion } from "framer-motion";
import { Feature } from "@/types/landing-page/feature";

const FeatureItem: React.FC<Feature> = ({
  badgeText,
  title,
  description,
  toolTip1,
  toolTip2,
  flip = false,
  gif
}) => {
  return (
    <div
      className={`
        flex flex-col-reverse items-center justify-between text-blue-900 rounded-2xl
        px-6 py-10 gap-10
        md:flex-row ${flip ? "md:flex-row-reverse" : ""}
        md:px-10 md:py-14
      `}
    >
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center bg-blue-50 rounded-2xl py-8 px-6 md:py-10 md:px-10 overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex justify-center items-center w-full max-w-md bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={`/gifs/${gif}.gif`}
            alt="Workflow Automation UI"
            className="w-full h-auto object-contain"
          />
        </div>
      </motion.div>

      <div className={`w-full md:w-1/2 ${flip ? "md:pr-10" : "md:pl-10"}`}>
        <Badge className="flex items-center justify-center px-4 py-1.5 w-fit bg-blue-100 text-blue-700 border-blue-100 rounded-lg mb-4 hover:bg-blue-200 duration-300">
          {badgeText}
        </Badge>

        <h3 className="text-2xl md:text-4xl font-semibold mb-4">{title}</h3>

        <p className="text-gray-500 mb-6 leading-relaxed text-base md:text-lg">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
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
