import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../../common/Card";

interface Review {
  name: string;
  improvement: string;
  content: string;
  rating: number;
}

const reviews: Review[] = [
  { name: "Marcus Williams", improvement: "Improved 150+ points", content: "I was struggling with the math section, but DailySAT helped me improve significantly.", rating: 5 },
  { name: "Sophia Chen", improvement: "Perfect 1600 scorer", content: "The strategies I learned from DailySAT were invaluable.", rating: 5 },
  { name: "Ava Martinez", improvement: "Perfect 1600 scorer", content: "I couldn't have achieved a perfect score without DailySAT!", rating: 5 },
  { name: "Emily Rodriguez", improvement: "Improved 180+ points", content: "The daily practice approach really worked for me.", rating: 5 },
  { name: "Olivia Taylor", improvement: "Improved 190+ points", content: "The personalized recommendations helped a lot!", rating: 5 },
  { name: "Alex Johnson", improvement: "Improved 200+ points", content: "DailySAT's practice tests were incredibly useful.", rating: 5 },
];

export function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-10">
      <motion.div
        className="flex gap-6"
        animate={{ x: `-${(currentIndex % reviews.length) * 300}px` }}
        transition={{ ease: "linear", duration: 1 }}
      >
        {[...reviews, ...reviews].map((review, index) => (
          <Card key={index} className="min-w-[280px] p-6 bg-white shadow-lg rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">{review.content}</p>
              <h4 className="font-semibold">{review.name}</h4>
              <p className="text-sm text-gray-500">{review.improvement}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
