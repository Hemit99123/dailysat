import { Answers } from "./answer";

// Shared between both components (props)

export type questionType = "math" | "reading-writing";

export interface QuestionsProps {
  onAnswerSubmit: (answer: Answers) => void;
}

// Types for READING question

export interface Highlight {
  text: string;
  startOffset: number;
  endOffset: number;
}

export interface QuestionData {
  _id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
  skill: string;
}

export interface DBQuestionRecord {
  _id : string;
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: number;
  explanation: string;
  skill: string;
  toc : number;
  userAnswer : string;
  correct : number; 
}