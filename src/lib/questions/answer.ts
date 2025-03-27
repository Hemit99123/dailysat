import { Answers } from "@/types/sat-platform/answer";

// converts the answer from a,b,c,d to numerical form (based on index pos)
export const answerCorrectRef: Record<Answers, number> = { A: 0, B: 1, C: 2, D: 3 };