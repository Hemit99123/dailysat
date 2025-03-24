import React, { FC } from "react";
import { Wrapper } from "@/types/wrapper";

const QuestionWrappers: FC<Wrapper> = ({ children }) => {
  return (
    <div className="flex flex-col flex-grow p-5 md:p-10 w-full">
      {children}
    </div>
  );
};

export default QuestionWrappers;