import { useState, useEffect } from "react";

const DATA_URL = "https://api.jsonsilo.com/public/adc25e60-df9f-48b2-a1ac-82e5fc8ce524"; // put your actual URL or local path

export type VocabItem = {
  word: string;
  sentence: string;
};

export type Question = {
  id: string;
  question: string; // sentence prompt
  choices: string[]; // 4 words
  correct_answer: string;
};

export const useVocabPracticeSession = () => {
  const [vocabData, setVocabData] = useState<VocabItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const res = await fetch(DATA_URL);
        const json: VocabItem[] = await res.json();
        setVocabData(json);
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to fetch vocab", e);
        setIsLoading(false);
      }
    };

    fetchVocab();
  }, []);

  const pickRandomItems = (arr: any[], n: number) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  const generateQuestion = () => {
    if (vocabData.length < 4) return;

    const fourItems = pickRandomItems(vocabData, 4);
    const correctItem = fourItems[Math.floor(Math.random() * 4)];
    const correctAnswer = correctItem.word;
    const choices = pickRandomItems(fourItems.map(i => i.word), 4);

    setCurrentQuestion({
      id: Date.now().toString(),
      question: correctItem.sentence,
      choices,
      correct_answer: correctAnswer,
    });
  };

  useEffect(() => {
    if (!isLoading && vocabData.length >= 4) {
      generateQuestion();
    }
  }, [isLoading, vocabData]);

  return {
    currentQuestion,
    generateQuestion,
    isLoading,
  };
};