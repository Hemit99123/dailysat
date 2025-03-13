export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
  }
  
  export interface TutorResponse {
    explanation: string;
    question: Question;
  }
  
  export interface Question {
    text: string;
    choices: {
      id: string;
      text: string;
      correct: boolean;
    }[]
    explanation: string
    hint: string
  }

