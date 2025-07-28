"use client";

import React, { useState } from "react";
import { useVocabPracticeSession } from "@/hooks/useVocabPracticeSession"; // ✅ use @ alias if configured

export default function VocabPracticePage() {
  const { currentQuestion, generateQuestion, isLoading } = useVocabPracticeSession();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (isLoading) return <div>Loading vocab...</div>;
  if (!currentQuestion) return <div>No question available.</div>;

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const correct = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    generateQuestion();
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2>Vocabulary Practice</h2>
      <p><em>Definition / Sentence:</em></p>
      <p style={{ fontSize: 18, fontWeight: "bold" }}>{currentQuestion.question}</p>

      <div style={{ marginTop: 20 }}>
        {currentQuestion.choices.map((choice: string) => (
          <button
            key={choice}
            onClick={() => !isSubmitted && setSelectedAnswer(choice)}
            style={{
              display: "block",
              margin: "10px 0",
              padding: "10px 15px",
              width: "100%",
              backgroundColor:
                isSubmitted
                  ? choice === currentQuestion.correct_answer
                    ? "lightgreen"
                    : choice === selectedAnswer
                    ? "lightcoral"
                    : "white"
                  : choice === selectedAnswer
                  ? "lightblue"
                  : "white",
              border: "1px solid #ccc",
              cursor: isSubmitted ? "default" : "pointer",
              textAlign: "left",
              borderRadius: 4,
            }}
            disabled={isSubmitted}
          >
            {choice}
          </button>
        ))}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          style={{ marginTop: 20, padding: "10px 20px" }}
        >
          Submit
        </button>
      ) : (
        <div style={{ marginTop: 20 }}>
          {isCorrect ? (
            <p style={{ color: "green", fontWeight: "bold" }}>✅ Correct!</p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ❌ Incorrect. The correct answer was: <strong>{currentQuestion.correct_answer}</strong>
            </p>
          )}
          <button onClick={handleNext} style={{ padding: "10px 20px" }}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
