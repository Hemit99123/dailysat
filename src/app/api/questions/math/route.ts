import { getQuestion } from "@/lib/questions";


/**
 * @swagger
 * /api/questions/math:
 *   get:
 *     summary: Retrieve a math question
 *     description: Fetches a random math question from a JSON file.
 *     responses:
 *       200:
 *         description: Successfully retrieved a math question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                   description: The math question retrieved from the database.
 *                 options:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Possible answer choices for the question.
 *                 correctAnswer:
 *                   type: string
 *                   description: The correct answer to the question.
 *       500:
 *         description: Internal server error due to issues retrieving the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 500
 *                 error:
 *                   type: string
 *                   description: A generic error message for debugging.
 *                   example: Internal server error
 */


export const GET = async (request: Request) => {
  const question = await getQuestion(request, "questions-math")
  return question
};
