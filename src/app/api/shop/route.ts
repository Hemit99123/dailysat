import { ShopItem } from "@/types/shopitem";
import { client } from "../../../lib/mongo";
import { Db } from "mongodb";
import { User } from "@/types/user"; // assume you saved the User interface here
import { auth } from "@/lib/auth";
import { format } from "date-fns";

/**
 * Appends an array of items to a user's "itemsBought" array.
 * @param email - The email of the user.
 * @param items - An array of items to append to the itemsBought array.
 */
export const POST = async (request: Request) => {
  const { items, coins } = await request.json();
  console.log(coins);
  if (!Array.isArray(items)) {
    return Response.json({
      result: "Items must be an array",
    });
  }

  try {
    console.log("Pinging server");

    await client.connect();
    const db: Db = client.db("DailySAT");

    const users = db.collection<User>("users");
    // Proceed with the rest of the logic
    const session = await auth();
    console.log("get auth");
    const userEmail: string | null | undefined = session?.user?.email;
    if (!userEmail) {
      console.log("Email not found");

      throw new Error("Email not found");
    }
    console.log(userEmail);
    const totalCost = items.reduce((sum, item) => {
      const quantity = item.amnt ?? 1;
      return sum + item.price * quantity;
    }, 0);
    console.log(totalCost);
    if (coins < totalCost)
      return Response.json({
        result: "Cannot complete purchase",
      });
    const result = await users.updateOne(
      { email: userEmail },
      {
        $push: {
          itemsBought: {
            $each: items,
          },
        },
        $set: {
          currency: coins - totalCost,
        },
      }
    );
    let investors = items.filter((elem: ShopItem) =>
      elem.name.includes("Investor")
    );
    if (investors) {
      const result = format(new Date(), "MM/dd/yyyy");

      const formattedDate = result;
      investors = investors.map(
        (elem: ShopItem) =>
          (elem = {
            ...elem,
            date: formattedDate,
            reward: elem.name.includes("IV")
              ? 20
              : elem.name.includes("III")
                ? 15
                : elem.name.includes("II")
                  ? 10
                  : 5,
          })
      );
      await users.updateOne(
        { email: userEmail },
        {
          $push: {
            investors: {
              $each: investors,
            },
          },
        }
      );
    }
    console.log("db updated");
    if (result.matchedCount === 0) {
      console.log("unsuccessful");
      console.log(result);
      return Response.json({
        result: "User not found",
      });
    }
    console.log("Items bought");
    return Response.json({
      result: "Success - items bought",
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      result: "DB Error",
    });
    
  } finally {
    await client.close();
  }
};
