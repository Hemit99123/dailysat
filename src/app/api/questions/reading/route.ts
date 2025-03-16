import { getQuestion } from "@/lib/questions/index";

/**
 * @swagger
 * /api/questions/reading:
 *   get:
 *     description: 
 *       Retrieves a random question from the "questions" collection in MongoDB based on the provided `topic`.
 *       If the `topic` query parameter is not provided, the API will return an error.
 *     parameters:
 *       - name: topic
 *         in: query
 *         description: The topic or skill for which a random question should be fetched.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A random question that matches the provided topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doc_array:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the question document in MongoDB.
 *                       question:
 *                         type: string
 *                         description: The text of the question.
 *                       skill:
 *                         type: string
 *                         description: The topic or skill associated with the question.
 *                       answer:
 *                         type: string
 *                         description: The answer to the question.
 *       400:
 *         description: Missing or invalid `topic` query parameter.
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
  const question = await getQuestion(request, "questions-reading")
  return question
}
