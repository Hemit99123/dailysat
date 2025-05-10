// User interface representing a user in the system

import { StudyPlanProps } from "@/components/features/AI/StudyPlan";
import { ShopItem } from "./shopitem";
import { Investor } from "./shop/investor";

export interface User {
    // MongoDB string 
    _id? : string,
    email: string,
    name: string,
    image: string,
    isReferred: boolean,
  
    // Currency
    currency: number,
  
    // Questions answered
    correctAnswered: number;
    wrongAnswered: number;
    // Items bought
    itemsBought: ShopItem[];
    investors?: Investor[];
    plan?: StudyPlanProps
}