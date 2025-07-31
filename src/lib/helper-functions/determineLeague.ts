// Helper function to determine league based on points
export const determineLeague = (points: number): string => {
  if (points >= 200) return "Platinum";
  if (points >= 100) return "Gold";
  if (points >= 50) return "Silver";
  if (points >= 20) return "Bronze";
  return "None";
};
