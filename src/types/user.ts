// User interface representing a user in the system
import { DBQuestionRecord } from "./questions";

export interface User {
    // MongoDB string 
    _id? : string,
    email: string,
    name: string,
    image: string,
  
    // Currency
    currency: number,
  
    // Questions answered
    questionsAnswered: DBQuestionRecord[]
}