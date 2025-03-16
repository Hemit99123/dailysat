/* eslint-disable */

import { Answers } from '@/types/sat-platform/answer';
import React from 'react';

// Toggle cross-off mode
export const toggleCrossOffMode = (setCrossOffMode: React.Dispatch<React.SetStateAction<boolean>>) => {
  setCrossOffMode((prevMode) => !prevMode);
};

  // Toggle cross-off for an option
export const toggleCrossOffOption = (setCrossedOffOptions: React.Dispatch<React.SetStateAction<any>>, option: Answers) => {
    setCrossedOffOptions((prev: any) => {
      const updated = new Set(prev);
      if (updated.has(option)) {
        updated.delete(option);
      } else {
        updated.add(option);
      }
      return updated;
    });
  };
