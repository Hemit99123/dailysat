export type Question = {
  id: string;
  domain: string;
  visuals: { type: string; svg_content: string };
  question: {
    choices: Record<string, string>;
    question: string;
    paragraph: string | null;
    explanation: string;
    correct_answer: string;
  };
  difficulty: "Easy" | "Medium" | "Hard" | string;
};

export type QuestionHistory = {
  id: number;
  question: Question;
  userAnswer: string | null;
  isCorrect: boolean | null;
  isMarkedForLater: boolean;
  isAnswered: boolean;
};

export interface QuestionData {
  questionMeta: {
    _id: string;
    key: string;
    id: string;
    visuals: {
      type: string;
      svg_content: string;
    };
    question: {
      choices: Record<string, string>;
      question: string;
      paragraph?: string;
      explanation: string;
      correct_answer: string;
    };
    difficulty: string;
    subject: string;
  };
}

export interface RawStemQuestion {
  choices: Record<string, string>;
  question: string;
  paragraph?: string;
  explanation: string;
  correct_answer: string;
  stemHtml: string;
  stem: string;
  prompt: string;
}
