import {client} from "@/lib/mongo";
import { Collection, Db, Document, InsertOneResult } from "mongodb";

/**
 * @swagger
 * /api/beta/bug:
 *   get:
 *     description: 
 *       Retrieves data related to a specific bug by ID. If the `id` query parameter is not provided,
 *       the API will return an error message. If the `id` is valid, the system will insert it into the 
 *       "bugged" collection in MongoDB.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The ID of the bug to be fetched and inserted into the database.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bug ID successfully inserted into the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                       description: Indicates whether the insert operation was acknowledged by the database.
 *                     insertedId:
 *                       type: string
 *                       description: The unique ID assigned to the newly inserted document in MongoDB.
 *       400:
 *         description: Missing or invalid `id` query parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code indicating the error type.
 *                 error:
 *                   type: string
 *                   description: Error message explaining why the request failed.
 *       500:
 *         description: Internal server error, including database connection issues.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code indicating the error type.
 *                 error:
 *                   type: string
 *                   description: A generic error message for internal server issues.
 */

export const GET = async (request: Request) => {
  const url: URL = new URL(request.url);
  const searchParams: URLSearchParams = new URLSearchParams(url.search);
  const id: string = searchParams.get("id") || "";
  const text : string = searchParams.get("text") || "";

  // Check if the id query parameter is provided
  if (id === "" || text === "") {
    return Response.json({
      code: 400,
      error: "no id and/or text parameter specified", // Adjusted to 400 since it's a client-side error
    });
  } else {
    try {
      await client.connect();
      const db: Db = client.db("DailySAT");
      const coll: Collection<Document> = db.collection("bugged");
      
      // Insert the new bug ID into the database
      const result: InsertOneResult<Document> = await coll.insertOne({ "id": id, "text":text });
      
      // Return a success response with the inserted result
      return Response.json({
        result: {
          acknowledged: result.acknowledged,
          insertedId: result.insertedId,
        },
      });
    } catch (error) {
      // Handle any database errors
      return Response.json({
        code: 500,
        error: "Internal server error",
        errorMsg: error
      });
    }
  }
}