import { englishSubjectsArray, mathSubjectsArray } from "@/data/subject";

export type Type = "math" | "english";
export type MathSubjects = typeof mathSubjectsArray[number];
export type EnglishSubjects = typeof englishSubjectsArray[number];

// This conditionally renders MathSubjects or EnglishSubjects depending on the generic of T (type)
export type SubjectFor<T extends Type> = T extends "math" ? MathSubjects : EnglishSubjects;
