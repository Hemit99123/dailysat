import React, { FC } from "react";
import { Wrapper } from "@/types/wrapper";

const MainWrappers: FC<Wrapper> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {children}
    </div>
  );
};

export default MainWrappers;