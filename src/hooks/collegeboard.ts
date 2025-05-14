// // hooks/collegeboard.ts
// import axios from "axios";

// export interface CollegeBoardQuestion {
//   id: string;
//   question: string;
//   answerOptions: { label: string; content: string }[];
//   correctAnswer: string;
//   explanation: string;
// }

// export const getCollegeBoardMathQuestion = async (): Promise<CollegeBoardQuestion | null> => {
//   try {
//     const listResponse = await axios.post(
//       "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-questions",
//       {
//         asmtEventId: 100,
//         test: 1,
//         domain: "INI,CAS,EOI,SEC",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: process.env.NEXT_PUBLIC_COLLEGEBOARD_COOKIE || "",
//         },
//       }
//     );

//     const questionList = listResponse.data;
//     if (!questionList || questionList.length === 0) return null;

//     const chosen = questionList[Math.floor(Math.random() * questionList.length)];
//     const externalId = chosen.external_id;

//     const detailResponse = await axios.post(
//       "https://qbank-api.collegeboard.org/msreportingquestionbank-prod/questionbank/digital/get-question",
//       { external_id: externalId },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: process.env.NEXT_PUBLIC_COLLEGEBOARD_COOKIE || "",
//         },
//       }
//     );

//     const q = detailResponse.data;
//     return {
//       id: externalId,
//       question: `${q.stimulus}<br /><br />${q.stem}`,
//       answerOptions: q.answerOptions.map((opt, idx) => ({
//         label: String.fromCharCode(65 + idx), // A, B, C, D...
//         content: opt.content,
//       })),
//       correctAnswer: q.correct_answer[0],
//       explanation: "", // You can leave this empty or fetch later
//     };
//   } catch (err) {
//     console.error("Error fetching CollegeBoard question:", err);
//     return null;
//   }
// };
