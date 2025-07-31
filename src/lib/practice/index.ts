import { Difficulty } from "@/types/practice/difficulty";
import { SubjectFor } from "@/types/practice/subject";
import { Type } from "@/types/practice/subject";
import axios from "axios";

export const handleFetchQuestion = async <T extends Type>(
  type: T,
  difficulty: Difficulty,
  subject: SubjectFor<T>
) => {
  const response = await axios.get(
    `/api/get-question?type=${type}&subject=${subject}&difficulty=${difficulty}`
  );
  return response;
};
