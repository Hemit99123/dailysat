import { englishSubjectsArray, mathSubjectsArray } from "@/data/subject";
import { client, db } from "@/lib/mongo";
import { MatchObject } from "@/types/mongo/match-query";
import { EnglishSubjects, MathSubjects } from "@/types/practice/subject";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const subject = searchParams.get("subject");
  const difficulty = searchParams.get("difficulty");

  if (!type || !subject || !difficulty) {
    return Response.json({
      error:
        "You must provide a query paramater of type, subject, and difficulty",
    });
  }

  if (
    (type !== "math" && type !== "english") ||
    (type === "math" && !mathSubjectsArray.includes(subject as MathSubjects)) ||
    (type === "english" &&
      !englishSubjectsArray.includes(subject as EnglishSubjects))
  ) {
    return Response.json({
      error:
        "Query parameter must be 'math' or 'english' and subject must be valid",
    });
  }

  try {
    await client.connect();

    const collectionName = type === "math" ? "math" : "english";
    const collection = db.collection(collectionName);

    const matchObject: MatchObject = {};

    if (difficulty != "All") {
      matchObject.difficulty = difficulty;
    }

    if (subject != "All") {
      matchObject.subject = subject;
    }

    // The $sample gives questions in random order (so we can retrieve a rand question)
    const questionMeta = await collection
      .aggregate([{ $match: matchObject }, { $sample: { size: 1 } }])
      .next();

    return Response.json(
      {
        questionMeta,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        result: "Server error",
      },
      { status: 500 }
    );
  }
};
