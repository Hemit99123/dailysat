"use client";

import React from "react";

const mathQuiz = [
  {
    question: "What is the solution to the equation 2x + 5 = 15?",
    options: ["x = 5", "x = 10", "x = 2.5", "x = -5"],
    correctAnswer: "x = 5",
  },
  {
    question: "If 3x - 7 = 11, what is the value of x?",
    options: ["x = 6", "x = 4", "x = 3", "x = 7"],
    correctAnswer: "x = 6",
  },
  {
    question: "Which of the following is a quadratic equation?",
    options: ["x + 2 = 5", "x^2 + 3x - 4 = 0", "2x - 7 = 3", "x/2 = 4"],
    correctAnswer: "x^2 + 3x - 4 = 0",
  },
  {
    question: "A recipe requires a ratio of 2:5 for sugar to flour. If you use 10 cups of flour, how much sugar is needed?",
    options: ["2 cups", "4 cups", "5 cups", "20 cups"],
    correctAnswer: "4 cups",
  },
  {
    question: "If a shirt originally costs $50 and is on sale for 20% off, what is the sale price?",
    options: ["$40", "$30", "$25", "$10"],
    correctAnswer: "$40",
  },
  {
    question: "What is the slope of the line represented by y = 3x - 2?",
    options: ["3", "-2", "2", "-3"],
    correctAnswer: "3",
  },
  {
    question: "Which of the following represents a function?",
    options: ["x^2 = y", "x + y = 3", "x = 5", "y^2 = x"],
    correctAnswer: "x^2 = y",
  },
  {
    question: "What is the value of 2^3?",
    options: ["6", "8", "4", "12"],
    correctAnswer: "8",
  },
  {
    question: "Simplify: (x + 2)(x - 3)",
    options: ["x^2 - x - 6", "x^2 + 5", "x^2 - 6", "x^2 + 6x - 6"],
    correctAnswer: "x^2 - x - 6",
  },
  {
    question: "What is the solution to the inequality 2x - 4 > 6?",
    options: ["x > 5", "x < 5", "x > 2", "x < 2"],
    correctAnswer: "x > 5",
  },
  {
    question: "Which expression is equivalent to (x^3)^2?",
    options: ["x^5", "x^6", "x^9", "x^4"],
    correctAnswer: "x^6",
  },
  {
    question: "If f(x) = 2x + 1, what is f(3)?",
    options: ["7", "6", "5", "9"],
    correctAnswer: "7",
  },
  {
    question: "What is the solution to the exponential equation 3^x = 27?",
    options: ["x = 2", "x = 3", "x = 4", "x = 5"],
    correctAnswer: "x = 3",
  },
  {
    question: "Which of the following is a rational equation?",
    options: ["x^2 + 2x = 3", "x/2 = 4", "3x - 5 = 7", "x^3 = 8"],
    correctAnswer: "x/2 = 4",
  },
  {
    question: "The graph shows a parabola. What type of equation does it represent?",
    options: ["Linear", "Quadratic", "Exponential", "Rational"],
    correctAnswer: "Quadratic",
  },
  {
    question: "If 5x + 2 = 3x + 8, what is the value of x?",
    options: ["x = 3", "x = 2", "x = 4", "x = 6"],
    correctAnswer: "x = 3",
  },
  {
    question: "A car travels 60 miles in 1.5 hours. What is its average speed?",
    options: ["30 mph", "40 mph", "50 mph", "60 mph"],
    correctAnswer: "40 mph",
  },
  {
    question: "What is the product of (x - 4)(x + 4)?",
    options: ["x^2 - 16", "x^2 + 16", "x^2 - 8", "x^2 + 8"],
    correctAnswer: "x^2 - 16",
  },
  {
    question: "If y = 2x^2 - 3x + 1, what is y when x = 2?",
    options: ["3", "4", "5", "7"],
    correctAnswer: "3",
  },
  {
    question: "Simplify the expression: 4(x - 2) + 3x",
    options: ["7x - 8", "7x + 8", "x - 8", "x + 8"],
    correctAnswer: "7x - 8",
  },
];

const readingWritingQuiz = [
  {
    question: "What is the main idea of a passage?",
    options: ["The most important point", "The supporting detail", "The author's opinion", "A random fact"],
    correctAnswer: "The most important point",
  },
  {
    question: "Which sentence shows an inference?",
    options: ["The sky is blue.", "It will probably rain because it's cloudy.", "The book is on the table.", "The door is open."],
    correctAnswer: "It will probably rain because it's cloudy.",
  },
  {
    question: "What does 'author's purpose' mean?",
    options: ["To confuse the reader", "To entertain, inform, or persuade", "To add details", "To explain structure"],
    correctAnswer: "To entertain, inform, or persuade",
  },
  {
    question: "Which word best fits as precise word choice?",
    options: ["Thing", "Object", "Tool", "Hammer"],
    correctAnswer: "Hammer",
  },
  {
    question: "Which of these shows effective text structure?",
    options: ["Random sentences", "Chronological order", "Unrelated ideas", "Confusing grammar"],
    correctAnswer: "Chronological order",
  },
  {
    question: "What helps logical progression in writing?",
    options: ["Jumping between ideas", "Clear connections between points", "Random facts", "Vague wording"],
    correctAnswer: "Clear connections between points",
  },
  {
    question: "Which is a correct use of punctuation?",
    options: ["Lets eat, Grandma!", "Lets eat Grandma!", "Lets, eat Grandma!", "Lets eat Grandma."],
    correctAnswer: "Lets eat, Grandma!",
  },
  {
    question: "Which sentence shows clarity and precision?",
    options: ["She did something somewhere.", "The technician repaired the broken laptop.", "It happened.", "Things were done."],
    correctAnswer: "The technician repaired the broken laptop.",
  },
  {
    question: "What shows effective transitions?",
    options: ["However, therefore, in addition", "And, but, the", "To, at, by", "Because, since, if"],
    correctAnswer: "However, therefore, in addition",
  },
  {
    question: "What is a supporting detail?",
    options: ["A fact that explains the main idea", "The main idea itself", "An unrelated sentence", "The conclusion"],
    correctAnswer: "A fact that explains the main idea",
  },
  {
    question: "What type of structure presents cause and effect?",
    options: ["List", "Problem and solution", "Chronological", "Cause and effect"],
    correctAnswer: "Cause and effect",
  },
  {
    question: "Which is an example of correct sentence structure?",
    options: ["The dog barked.", "Barked dog.", "Dog the barked.", "Barked the dog."],
    correctAnswer: "The dog barked.",
  },
  {
    question: "What does 'logical progression' mean?",
    options: ["Ideas follow in a clear order", "Ideas are random", "No structure", "Off-topic details"],
    correctAnswer: "Ideas follow in a clear order",
  },
  {
    question: "What is an inference?",
    options: ["A guess with no evidence", "A conclusion based on evidence", "An opinion", "A direct statement"],
    correctAnswer: "A conclusion based on evidence",
  },
  {
    question: "Which sentence shows correct grammar and usage?",
    options: ["They goes to school.", "He is running.", "She go to work.", "It walk fast."],
    correctAnswer: "He is running.",
  },
  {
    question: "What does 'effective transitions' help with?",
    options: ["Confusing the reader", "Making writing flow smoothly", "Adding random details", "Starting new topics"],
    correctAnswer: "Making writing flow smoothly",
  },
  {
    question: "Which sentence demonstrates author's purpose to inform?",
    options: ["A story about a hero", "A news article about weather", "A poem", "A persuasive ad"],
    correctAnswer: "A news article about weather",
  },
  {
    question: "What shows precise word choice?",
    options: ["Thing", "Vehicle", "Car", "Transportation"],
    correctAnswer: "Car",
  },
  {
    question: "What does punctuation help with?",
    options: ["Clarity and meaning", "Making sentences longer", "Adding random marks", "Confusing readers"],
    correctAnswer: "Clarity and meaning",
  },
  {
    question: "What is the role of supporting details?",
    options: ["Explain the main idea", "Distract the reader", "Change topics", "Add confusion"],
    correctAnswer: "Explain the main idea",
  },
];

function FinalQuiz({ quizType, onBack }: { quizType: "math" | "reading"; onBack: () => void }) {
  const quiz = quizType === "math" ? mathQuiz : readingWritingQuiz;
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [showResults, setShowResults] = React.useState(false);

  const handleSelect = (idx: number, option: string) => {
    if (answers[idx]) return;
    setAnswers((prev) => ({ ...prev, [idx]: option }));
  };

  const correctCount = quiz.filter((q, i) => answers[i] === q.correctAnswer).length;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
      <h2 className="text-2xl font-bold mb-4 text-center">{quizType === "math" ? "Math" : "Reading & Writing"} Final Quiz</h2>
      {quiz.map((q, idx) => (
        <div key={idx} className="mb-6 p-4 border rounded bg-gray-100">
          <p className="font-medium mb-2">Q{idx + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const selected = answers[idx] === opt;
              const correct = q.correctAnswer === opt;
              const isAnswered = answers[idx];
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(idx, opt)}
                  className={`block w-full text-left px-4 py-2 rounded border ${
                    !isAnswered
                      ? "hover:bg-gray-200"
                      : correct
                      ? "bg-green-200 border-green-400"
                      : selected
                      ? "bg-red-200 border-red-400"
                      : "bg-white"
                  }`}
                  disabled={!!isAnswered}
                >
                  {opt}
                  {isAnswered && correct && <span className="ml-2 text-green-600 font-bold">✔</span>}
                  {isAnswered && selected && !correct && <span className="ml-2 text-red-600 font-bold">✖</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        onClick={() => setShowResults(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4 w-full"
        disabled={Object.keys(answers).length !== quiz.length}
      >
        Submit Quiz
      </button>

      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 text-center text-black">
            <button
              onClick={onBack}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
            <p className="text-lg mb-2">You got {correctCount} out of {quiz.length} correct!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalQuiz;
