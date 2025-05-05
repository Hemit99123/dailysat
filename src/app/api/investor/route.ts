import { client } from "../../../lib/mongo";
import { Db } from "mongodb";
import { auth } from "@/lib/auth";
import { User } from "@/types/user";
import { parse, differenceInDays, format } from "date-fns";

export const POST = async () => {
    console.log("connecting to client")
  try {
    await client.connect();
    const db: Db = client.db("DailySAT");
    const users = db.collection<User>("users");

    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return Response.json({ result: "Unauthorized" }, { status: 401 });
    }

    const user = await users.findOne({ email: userEmail });

    if (!user || !Array.isArray((user as User).investors)) {
      return Response.json({ totalQuantity: 0 });
    }

    const today = new Date();
    const formattedToday = format(today, "MM/dd/yyyy");

    let totalQuantity = 0;

    const updatedInvestors = user.investors?.map((investor) => {
      try {
        const parsedDate = parse(investor.date, "MM/dd/yyyy", new Date());
        const daysHeld = differenceInDays(today, parsedDate);

        const amnt = investor.amnt ?? 1;
        const reward = investor.reward ?? 0;
        const quantity = daysHeld * amnt * reward;
        totalQuantity += quantity;

        // Update date to today
        return {
          ...investor,
          date: formattedToday,
        };
      } catch {
        return {
          ...investor,
          date: formattedToday,
        };
      }
    });
    totalQuantity+=user?.currency
    await users.updateOne(
      { email: userEmail },
      {
        $set: {
          investors: updatedInvestors,
          currency: totalQuantity,
        },
      }
    );
    return Response.json({ totalQuantity });
  } catch (error) {
    console.error("Investor calculation error:", error);
    return Response.json({ result: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
};
