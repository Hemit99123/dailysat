import { StudyDay } from "./studyDay";

export interface ValidPlan {
  isDebug?: false;
  isError?: false;
  days: StudyDay[];
}
