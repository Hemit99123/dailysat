import { QuestionData } from "@/types/practice/questions";

export const handleCacheQuestion = async (question: QuestionData) => {
    // add logic here
    console.log("Caching question:", question.questionMeta._id);
}