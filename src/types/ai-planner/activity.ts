export interface Activity {
  topic: string;
  description: string;
  duration: number;
  type: "review" | "practice" | "lecture" | string;
}
