import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";

import User from "@/database/user.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model"; // ✅ Add this if you want answer search too

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";

  if (!query.trim()) {
    return NextResponse.json({
      users: [],
      questions: [],
      answers: [],
      tags: [],
    });
  }

  await dbConnect();
  const regex = new RegExp(query, "i");

  const usersPromise =
    type === "user" || type === "all"
      ? User.find({ username: regex }).limit(5)
      : Promise.resolve([]);

  const questionsPromise =
    type === "question" || type === "all"
      ? Question.find({ title: regex }).limit(5)
      : Promise.resolve([]);

  const tagsPromise =
    type === "tag" || type === "all"
      ? Tag.find({ name: regex }).limit(5)
      : Promise.resolve([]);

  const answersPromise =
    type === "answer" || type === "all"
      ? Answer.find({ content: regex }).limit(5)
      : Promise.resolve([]);

  const [users, questions, answers, tags] = await Promise.all([
    usersPromise,
    questionsPromise,
    answersPromise,
    tagsPromise,
  ]);

  return NextResponse.json({
    users,
    questions,
    answers,
    tags,
  });
}
