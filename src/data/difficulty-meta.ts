import { SubjectSidebarProps } from "@/components/features/Practice/SubjectSidebar";

export const DIFFICULTY_META: Record<
  SubjectSidebarProps["difficulty"],
  { bg: string; emoji: string; tooltip: string }
> = {
  All: {
    bg: "bg-gray-200",
    emoji: "⚪",
    tooltip: "All difficulties",
  },
  Easy: {
    bg: "bg-green-200",
    emoji: "😄",
    tooltip: "Easy questions",
  },
  Medium: {
    bg: "bg-amber-200",
    emoji: "🤨",
    tooltip: "Medium questions",
  },
  Hard: {
    bg: "bg-red-200",
    emoji: "😫",
    tooltip: "Hard questions",
  },
};
