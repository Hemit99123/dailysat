import { Db } from "mongodb";

// Helper function to update leaderboard
export const updateLeaderboard = async (
  db: Db,
  league: string,
  userData: {
    username: string;
    score: number;
  }
) => {
  try {
    // Validate inputs
    if (!league?.trim()) {
      throw new Error("League is required");
    }
    if (!userData?.username?.trim()) {
      throw new Error("Username is required");
    }
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
    // Check if we need to remove excess users (atomic operation)
    const totalUsers = await existingLeaderBoard.countDocuments({ league });
    if (totalUsers > 20) {
      await existingLeaderBoard.findOneAndDelete(
        { league },
        { sort: { score: 1 } } // Remove user with lowest score
      );
    }
  } catch (error) {
    console.error("Error updating leaderboard:", error);
    throw new Error("Failed to update leaderboard");
  }
};
