export async function getTodayGroupNumber(numGroups: number){
  const today = new Date();
  // Pick something repeatable: days since epoch mod numGroups
  const dayNumber = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  return (dayNumber % numGroups) + 1; // +1 to match "Group1", "Group2", etc.
}
