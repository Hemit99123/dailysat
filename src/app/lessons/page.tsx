"use client";
import React, { useState, useEffect, useRef, useReducer } from "react";
import content from "@/data/lessons/lessoncontent";
import FinalQuiz from "@/components/features/lessons/FinalQuiz";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

// 3D flip effect
const flipStyles: React.CSSProperties = {
  perspective: "1200px",
};
const flipInnerStyles: React.CSSProperties = {
  transformStyle: "preserve-3d",
};
const backfaceHidden: React.CSSProperties = {
  backfaceVisibility: "hidden",
};
const rotateY180: React.CSSProperties = {
  transform: "rotateY(180deg)",
};

export default function LessonsPage() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const [flipState, setFlipState] = useState<"none" | "flipping" | "flipped">(
    "none"
  );
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [panesVisible, setPanesVisible] = useState(false);
  const [showPractice, setShowPractice] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState<number>(0);
  const [completedSubtopics, setCompletedSubtopics] = useState<string[]>([]);
  const [completedDetails, setCompletedDetails] = useState<
    Record<string, { summary: boolean; practice: boolean }>
  >({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const quizContainerRef = useRef<HTMLDivElement>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  // rootRef will hold the React root for rendering ReactMarkdown

  const lessons = {
    Math: {
      Algebra: ["Linear Equations", "Inequalities", "Quadratic Equations"],
      "Problem Solving & Data Analysis": [
        "Ratios & Proportions",
        "Percentages",
        "Interpreting Graphs",
      ],
      "Advanced Math": [
        "Functions",
        "Polynomials",
        "Exponential & Rational Equations",
      ],
    },
    "Reading & Writing": {
      "Information & Ideas": ["Main Ideas", "Supporting Details", "Inferences"],
      "Craft & Structure": [
        "Word Choice",
        "Text Structure",
        "Author's Purpose",
      ],
      "Expression of Ideas": [
        "Clarity & Precision",
        "Logical Progression",
        "Effective Transitions",
      ],
      "Standard English Conventions": [
        "Grammar & Usage",
        "Sentence Structure",
        "Punctuation",
      ],
    },
  };

  const allSubtopics = Object.entries(lessons).flatMap(([_, topics]) =>
    Object.entries(topics).flatMap(([topic, subtopics]) =>
      subtopics.map((sub) => ({ subtopic: sub, topic }))
    )
  );
  const MARKDOWN_PROPS = {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeRaw as any, rehypeKatex],
  };
  const markdown = (content: string) => {
    const SHOW_SKELETON = content === "Loading...";

    return (
      <>
        {SHOW_SKELETON ? (
          <></>
        ) : (
          <div className="bg-blue-200 border border-blue-400 mt-2 p-4 rounded-lg">
            <ReactMarkdown {...MARKDOWN_PROPS}>{content}</ReactMarkdown>
          </div>
        )}
        {SHOW_SKELETON ? (
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="w-full h-64 bg-gray-400" />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  const INIT_STATE_ANS = ["", "", ""];
  const [answers, setAnswers] = useState<Array<string>>(INIT_STATE_ANS);

  const currentSubtopicData = allSubtopics[currentSubtopicIndex];
  const currentTopic = currentSubtopicData?.topic;
  const topicSubtopics = allSubtopics.filter((s) => s.topic === currentTopic);

  useEffect(() => {
    const storedProgress = localStorage.getItem("completedSubtopics");
    if (storedProgress) setCompletedSubtopics(JSON.parse(storedProgress));
    const storedDetails = localStorage.getItem("completedDetails");
    if (storedDetails) setCompletedDetails(JSON.parse(storedDetails));
    // Fade in panes after mount
    setTimeout(() => setPanesVisible(true), 100);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "completedSubtopics",
      JSON.stringify(completedSubtopics)
    );
  }, [completedSubtopics]);

  useEffect(() => {
    localStorage.setItem("completedDetails", JSON.stringify(completedDetails));
  }, [completedDetails]);

  const handleSubtopicClick = (subtopic: string) => {
    setFlipState("flipping");
    setTimeout(() => {
      const index = allSubtopics.findIndex((s) => s.subtopic === subtopic);
      setCurrentSubtopicIndex(index);
      setSelectedTopic(subtopic);
      setShowPractice(false);
      setSelectedAnswers({});
      setCompletedDetails((prev) => ({
        ...prev,
        [subtopic]: {
          summary: true,
          practice: prev[subtopic]?.practice ?? false,
        },
      }));
      setFlipState("flipped");
    }, 500);
  };

  const handleOpenFinalQuiz = (
    quizType: "FinalMathQuiz" | "FinalReadingWritingQuiz"
  ) => {
    setFlipState("flipping");
    setTimeout(() => {
      setSelectedTopic(quizType);
      setShowPractice(false);
      setFlipState("flipped");
    }, 500);
  };
  const sanitizeForPrompt = (text: string): string => {
    // Remove potential injection attempts
    return text.replace(/[<>]/g, "").slice(0, 1000); // Also limit length
  };
  const handleAnswerSelect = async (questionIndex: number, option: string) => {
    if (selectedAnswers[questionIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleNextSubtopic = () => {
    const nextSubtopics = allSubtopics.filter((s) => s.topic === currentTopic);
    const currentInTopicIndex = nextSubtopics.findIndex(
      (s) => s.subtopic === selectedTopic
    );

    if (!completedSubtopics.includes(selectedTopic!)) {
      setCompletedSubtopics([...completedSubtopics, selectedTopic!]);
    }

    setCompletedDetails((prev) => ({
      ...prev,
      [selectedTopic!]: {
        summary: prev[selectedTopic!]?.summary ?? true,
        practice: true,
      },
    }));

    if (currentInTopicIndex + 1 < nextSubtopics.length) {
      handleSubtopicClick(nextSubtopics[currentInTopicIndex + 1].subtopic);
    } else {
      setSelectedTopic(null);
    }
  };

  const resetProgress = () => {
    localStorage.removeItem("completedSubtopics");
    localStorage.removeItem("completedDetails");
    setCompletedSubtopics([]);
    setCompletedDetails({});
    setShowResetConfirm(false);
  };

  const overallProgress = Math.round(
    (completedSubtopics.length / allSubtopics.length) * 100
  );

  const topicProgress = Math.round(
    (topicSubtopics.filter((s) => completedSubtopics.includes(s.subtopic))
      .length /
      topicSubtopics.length) *
      100
  );

  const isFinalQuiz =
    selectedTopic === "FinalMathQuiz" ||
    selectedTopic === "FinalReadingWritingQuiz";

  const handleBackToLessons = () => {
    setFlipState("flipping");
    setTimeout(() => {
      setSelectedTopic(null);
      setShowPractice(false);
      setFlipState("none");
    }, 500);
  };

  useEffect(() => {
    if (quizFinished && quizContainerRef.current) {
      quizContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      setQuizFinished(false); // Resets for next time
    }
  }, [quizFinished]);

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col space-y-10">
        <div className="relative" style={flipStyles}>
          <div
            className={`transition-transform duration-500 ease-in-out w-full min-h-screen`}
            style={
              {
                ...flipInnerStyles,
                transform: flipState === "flipped" ? "rotateY(180deg)" : "none",
              } as any
            }
          >
            {/* Front: Lessons Page */}
            <div
              className="absolute w-full h-full top-0 left-0"
              style={
                {
                  ...backfaceHidden,
                  pointerEvents: flipState === "flipped" ? "none" : "auto",
                } as any
              }
            >
              {selectedTopic === null && (
                <>
                  <div
                    className={`flex-1 transition-opacity duration-700 ${panesVisible ? "opacity-100" : "opacity-0"}`}
                  >
                    <h1 className="text-4xl font-bold mb-6 text-center">
                      Lessons
                    </h1>

                    <div className="mb-6">
                      <div className="w-full bg-gray-300 h-4 rounded">
                        <div
                          className="bg-blue-500 h-4 rounded"
                          style={{ width: `${overallProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-center mt-2">
                        {overallProgress}% Completed
                      </p>
                    </div>

                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-700 ${panesVisible ? "opacity-100" : "opacity-0"}`}
                    >
                      {Object.entries(lessons).map(([section, topics]) => (
                        <div
                          key={section}
                          className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                        >
                          <h2 className="text-2xl font-semibold mb-4 text-center">
                            {section}
                          </h2>
                          {Object.entries(topics).map(([topic, subtopics]) => (
                            <div key={topic} className="mb-4">
                              <h3 className="font-medium mb-2">{topic}</h3>
                              <div className="space-y-2">
                                {subtopics.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => handleSubtopicClick(sub)}
                                    className={`block w-full text-left px-4 py-2 bg-white border rounded hover:bg-gray-100 ${
                                      completedSubtopics.includes(sub)
                                        ? "bg-green-100 border-green-300"
                                        : ""
                                    }`}
                                  >
                                    {sub}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`bg-white mt-4 rounded-lg shadow-lg p-6 border border-gray-200 transition-opacity duration-700 ${panesVisible ? "opacity-100" : "opacity-0"}`}
                  >
                    <h2 className="text-3xl font-bold mb-4 text-center">
                      Final Quizzes
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                      These quizzes test your skills from all subtopics!
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <button
                        onClick={() => handleOpenFinalQuiz("FinalMathQuiz")}
                        className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center text-xl"
                      >
                        Math Final Quiz (20 Questions)
                      </button>
                      <button
                        onClick={() =>
                          handleOpenFinalQuiz("FinalReadingWritingQuiz")
                        }
                        className="px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center text-xl"
                      >
                        Reading & Writing Final Quiz (20 Questions)
                      </button>
                    </div>
                  </div>
                  {/* Reset Confirmation Block */}
                  <div
                    className={`flex justify-center mt-8 pb-10 transition-opacity duration-700 ${panesVisible ? "opacity-100" : "opacity-0"}`}
                  >
                    {showResetConfirm ? (
                      <div className="flex flex-col items-center space-y-4">
                        <p className="text-red-600 font-semibold">
                          Are you sure you want to reset all progress?
                        </p>
                        <div className="flex space-x-4">
                          <button
                            onClick={resetProgress}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Yes, Reset
                          </button>
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Reset Progress
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* Back: Learning Interface */}
            <div
              className=" inset-0 w-full h-full"
              style={
                {
                  ...backfaceHidden,
                  ...rotateY180,
                  pointerEvents: flipState === "flipped" ? "auto" : "none",
                } as any
              }
            >
              {selectedTopic !== null && (
                <div className="flex w-full lg:flex-row flex-col-reverse justify-center items-stretch h-full">
                  {!isFinalQuiz && (
                    /* Units Sidebar */
                    <div
                      className={`bg-white rounded-lg h-full lg:mt-0 mt-4 shadow-lg border-2 border-gray-200 ${sidebarCollapsed ? "w-0 h-48 opacity-0 overflow-hidden p-0 mr-0" : "w-full lg:w-64 p-4 shadow-lg mr-6"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold">
                          {currentTopic} Units
                        </h2>
                        <button
                          onClick={() => setSidebarCollapsed(true)}
                          className="ml-2 p-1 rounded bg-gray-200 hover:bg-gray-300"
                          title="Collapse Sidebar"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-left-icon lucide-chevron-left h-5 lg:block hidden w-5 text-gray-700"
                          >
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-up-icon text-[12px] lucide-chevron-up h-5 lg:hidden block  w-5 text-gray-700"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </button>
                      </div>

                      <div className="mb-4">
                        <div className="w-full bg-gray-300 h-3 rounded">
                          <div
                            className="bg-blue-500 h-3 rounded"
                            style={{ width: `${topicProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm mt-1 text-center">
                          {topicProgress}% Completed
                        </p>
                      </div>

                      <ol className="space-y-2">
                        {topicSubtopics.map((s, idx) => {
                          const detail = completedDetails[s.subtopic] || {
                            summary: false,
                            practice: false,
                          };
                          return (
                            <li key={s.subtopic}>
                              <button
                                onClick={() => handleSubtopicClick(s.subtopic)}
                                className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 ${
                                  s.subtopic === selectedTopic
                                    ? "bg-blue-100"
                                    : completedSubtopics.includes(s.subtopic)
                                      ? "bg-green-100 border-green-300"
                                      : ""
                                }`}
                              >
                                Unit {idx + 1}: {s.subtopic}
                              </button>
                              {s.subtopic === selectedTopic && (
                                <div className="ml-4 mt-1 flex flex-col space-y-1">
                                  <button
                                    onClick={() => setShowPractice(false)}
                                    className={`text-left px-3 py-1 rounded hover:bg-gray-200 ${
                                      !showPractice ? "font-semibold" : ""
                                    }`}
                                  >
                                    Summary {detail.summary && "✔"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      setShowPractice((prev) => {
                                        setAnswers(INIT_STATE_ANS);
                                        return true;
                                      })
                                    }
                                    className={`text-left px-3 py-1 rounded hover:bg-gray-200 ${
                                      showPractice ? "font-semibold" : ""
                                    }`}
                                  >
                                    Practice {detail.practice && "✔"}
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}

                  {!isFinalQuiz && sidebarCollapsed && (
                    /* Add  sidebar expansion */
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className="mr-4 bg-blue-200 lg:block flex justify-center lg:mt-0 mt-4 lg:w-[35px] w-full hover:bg-gray-300 h-full p-2 rounded"
                      title="Expand Sidebar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 lg:block hidden w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down-icon text-[12px] lucide-chevron-down h-5 lg:hidden block  w-5 text-gray-700"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  )}

                  <div className="flex-1 h-full">
                    <div
                      className="bg-white p-6 overflow-y-auto w-full rounded-lg shadow-lg border border-gray-200 h-full"
                      ref={isFinalQuiz ? quizContainerRef : undefined}
                    >
                      <div className="w-full max-w-3xl mx-auto">
                        {isFinalQuiz ? (
                          <FinalQuiz
                            quizType={
                              selectedTopic === "FinalMathQuiz"
                                ? "math"
                                : "reading"
                            }
                            onBack={handleBackToLessons}
                          />
                        ) : !showPractice ? (
                          <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="text-3xl font-bold mb-2">
                              Summary of Topic
                            </h2>
                            <h3 className="text-2xl font-semibold mb-4">
                              {selectedTopic}
                            </h3>
                            <p className="mb-8 text-xl text-gray-700 max-w-2xl">
                              {content[selectedTopic]?.summary}
                            </p>
                            <button
                              onClick={() => {
                                setAnswers(INIT_STATE_ANS);
                                setShowPractice(true);
                              }}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Start Practice →
                            </button>
                            <button
                              onClick={handleBackToLessons}
                              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              Back to Lessons
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col space-y-4 pt-6">
                            <div className="flex justify-between mb-4">
                              <button
                                onClick={() => setShowPractice(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                Back
                              </button>
                            </div>

                            <h2 className="text-3xl font-bold mb-4 text-center">
                              Practice Questions
                            </h2>

                            {content[selectedTopic]?.practice.map((q, idx) => {
                              const isAnswered = selectedAnswers[idx];
                              const selectedOption = selectedAnswers[idx];
                              const isCorrect =
                                selectedOption === q.correctAnswer;

                              return (
                                <div
                                  key={idx}
                                  className="mb-6 p-4 border rounded bg-gray-100"
                                >
                                  <p className="font-medium mb-2">
                                    {q.question}
                                  </p>
                                  <div className="space-y-2">
                                    {q.options.map((opt) => {
                                      const selected = selectedOption === opt;
                                      const correct = q.correctAnswer === opt;
                                      return (
                                        <button
                                          key={opt}
                                          onClick={() =>
                                            handleAnswerSelect(idx, opt)
                                          }
                                          className={`flex items-center justify-between w-full text-left px-3 py-1 rounded border text-sm ${
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
                                          <span>{opt}</span>
                                          {isAnswered && correct && (
                                            <span className="text-green-600 font-bold">
                                              ✔
                                            </span>
                                          )}
                                          {isAnswered &&
                                            selected &&
                                            !correct && (
                                              <span className="text-red-600 font-bold">
                                                ✖
                                              </span>
                                            )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {isAnswered && (
                                    <>
                                      <p className="mt-2 text-sm text-gray-700">
                                        {q.explanation}
                                      </p>
                                      <button
                                        className="p-2 bg-blue-200 border border-blue-400 rounded-lg"
                                        id={`deepseek-explanation-${idx}`}
                                        onClick={async () => {
                                          if (
                                            (
                                              document.getElementById(
                                                `deepseek-explanation-${idx}`
                                              ) as HTMLButtonElement
                                            ).innerText === "Hide Explanation"
                                          ) {
                                            abortControllerRef.current?.abort();
                                            setAnswers((prev) => {
                                              const updated = [...prev];
                                              updated[idx] = "";
                                              return updated;
                                            });
                                            return;
                                          }
                                          abortControllerRef.current?.abort();
                                          abortControllerRef.current =
                                            new AbortController();
                                          setAnswers((prev) => {
                                            const updated = [...prev];
                                            updated[idx] = "Loading...";
                                            return updated;
                                          });
                                          try {
                                            const res = await axios.post(
                                              "/api/mistralai",
                                              {
                                                prompt:
                                                  sanitizeForPrompt(
                                                    q.question
                                                  ) +
                                                  `. Here are the answer choices: ${q.options}. The correct answer is ${q.correctAnswer}. Indicate the correct answer in bold and explain why it's right.`,
                                              },
                                              {
                                                signal:
                                                  abortControllerRef.current
                                                    .signal,
                                                timeout: 30000, // 30s timeout
                                              }
                                            );

                                            setAnswers((prev) => {
                                              const updated = [...prev];
                                              let expl = res?.data
                                                .replaceAll("\\times", "*")
                                                ?.replaceAll("\\boxed", "");
                                              updated[idx] =
                                                expl || "No response.";
                                              return updated;
                                            });
                                          } catch (err) {
                                            if (axios.isCancel(err)) {
                                              // Request was cancelled, do nothing
                                              return;
                                            }

                                            setAnswers((prev) => {
                                              const updated = [...prev];
                                              updated[idx] = "";
                                              return updated;
                                            });
                                            toast.error(
                                              "Sorry, there was a slight hiccup. Please try again later."
                                            );
                                          }
                                        }}
                                      >
                                        {answers[idx] === "Loading..."
                                          ? "Loading..."
                                          : answers[idx] === ""
                                            ? "Show Detailed Explanation"
                                            : "Hide Explanation"}
                                      </button>

                                      {answers[idx] && markdown(answers[idx])}
                                    </>
                                  )}
                                </div>
                              );
                            })}

                            <button
                              onClick={handleNextSubtopic}
                              className="self-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              {topicSubtopics.findIndex(
                                (s) => s.subtopic === selectedTopic
                              ) +
                                1 <
                              topicSubtopics.length
                                ? "Next Unit"
                                : "Finish"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
