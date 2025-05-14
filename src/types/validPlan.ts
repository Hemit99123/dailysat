import { StudyDay } from "./studyday";

export interface ValidPlan {
  isDebug?: false;
  isError?: false;
  days: StudyDay[];
}
