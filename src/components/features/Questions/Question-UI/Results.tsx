import { useAnswerCorrectStore } from "@/store/questions";
import { questionType } from "@/types/sat-platform/questions";
import React, { MutableRefObject } from "react";
import Image from "next/image"
import { parseContent } from "@/lib/latex";

interface ResultProps {
  answerComponent: MutableRefObject<HTMLDivElement | null>;
  explanation: string | undefined;
  type: questionType;
  imageUrls?: string[];
}

const Result: React.FC<ResultProps> = ({
  answerComponent,
  explanation,
  type,
  imageUrls,
}) => {
  const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);

  return (
    <div className="mt-4 pl-7 pb-10" ref={answerComponent}>
      {isAnswerCorrect !== "none" &&
      
        (isAnswerCorrect ? (
          <p className="text-green-500 text-lg font-semibold">
            You are correct!
          </p>
        ) : (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h5 className="text-red-500">Incorrect!</h5>
            {type === "math" ? parseContent(explanation || ""): explanation}
            {type === "math" &&
              imageUrls &&
              imageUrls.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`Explanation Visual ${idx}`}
                  width={200}
                  height={200}
                  className="mt-2"
                />
              ))}
          </div>
        ))}
    </div>
  );
};

export default Result;

// import { useAnswerCorrectStore } from "@/store/questions";
// import { questionType } from "@/types/sat-platform/questions";
// import React, { MutableRefObject, useEffect, useState } from "react";
// import Image from "next/image";
// import { parseContent } from "@/lib/latex";
// import Latex from "react-latex-next";

// interface ResultProps {
//   answerComponent: MutableRefObject<HTMLDivElement | null>;
//   explanation: string | undefined;
//   type: questionType;
//   imageUrls?: string[];
//   userAnswered?: boolean; // Add prop to check if user has answered
// }

// const Result: React.FC<ResultProps> = ({
//   answerComponent,
//   explanation,
//   type,
//   imageUrls,
//   userAnswered = false, // Default to false if not provided
// }) => {
//   const isAnswerCorrect = useAnswerCorrectStore((state) => state.isAnswerCorrect);
//   const [showExplanation, setShowExplanation] = useState(false);

//   // Only show the explanation when the user has answered
//   useEffect(() => {
//     setShowExplanation(userAnswered && isAnswerCorrect !== "none");
//   }, [userAnswered, isAnswerCorrect]);

//   return (
//     <div className="mt-4 pl-7 pb-10" ref={answerComponent}>
//       {showExplanation && (
//         isAnswerCorrect ? (
//           <p className="text-green-500 text-lg font-semibold">
//             You are correct!
//           </p>
//         ) : (
//           <div className="mt-4 p-4 bg-gray-100 rounded">
//             <h5 className="text-red-500">Incorrect!</h5>
//             {type === "math" ? (
//               <div className="math-explanation">
//                 <Latex>{explanation || ""}</Latex>
//               </div>
//             ) : (
//               explanation
//             )}
//             {type === "math" &&
//               imageUrls &&
//               imageUrls.map((url, idx) => (
//                 <Image
//                   key={idx}
//                   src={url}
//                   alt={`Explanation Visual ${idx}`}
//                   width={200}
//                   height={200}
//                   className="mt-2"
//                 />
//               ))}
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default Result;