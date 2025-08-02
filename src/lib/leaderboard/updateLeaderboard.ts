// Helper function to update leaderboard
export const updateLeaderboard = async (
  db: any,
  league: string,
  userData: {
    username: string;
    score: number;
  }
) => {
  const existingLeaderBoard = db.collection("leaderboard");

  // Upsert user
  await existingLeaderBoard.updateOne(
    { username: userData.username },
    {
      $set: {
        score: userData.score || 1,
        league: league,
      },
    },
    { upsert: true }
  );

  // Count ppl in this league
  const count = await existingLeaderBoard.countDocuments({ league });

  // > 20 users, then delete the lowest one
  if (count > 20) {
    await existingLeaderBoard.deleteOne(
      { league },
      { sort: { score: 1 } } // Deletes the user with lowest score
    );
  }
};
