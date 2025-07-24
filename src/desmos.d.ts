import { DesmosCalculator } from "./types/practice/desmos";

declare global {
    interface Window {
      Desmos: {
        GraphingCalculator: (element: HTMLElement) => DesmosCalculator;
      };
    }
  }
  
export {};  