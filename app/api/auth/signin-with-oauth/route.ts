// import mongoose from "mongoose";
// import { NextResponse } from "next/server";
// import slugify from "slugify";

// import Account from "@/database/account.model";
// import User from "@/database/user.model";
// import handleError from "@/lib/handlers/error";
// import { ValidationError } from "@/lib/http-errors";
// import dbConnect from "@/lib/mongoose";
// import { SignInWithOAuthSchema } from "@/lib/validations";

// export async function POST(request: Request) {
//   const { provider, providerAccountId, user } = await request.json();

//   await dbConnect();

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const validatedData = SignInWithOAuthSchema.safeParse({
//       provider,
//       providerAccountId,
//       user,
//     });

//     if (!validatedData.success)
//       throw new ValidationError(validatedData.error.flatten().fieldErrors);

//     const { name, username, email, image } = user;

//     const slugifiedUsername = slugify(username, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     let existingUser = await User.findOne({ email }).session(session);

//     if (!existingUser) {
//       [existingUser] = await User.create(
//         [{ name, username: slugifiedUsername, email, image }],
//         { session }
//       );
//     } else {
//       const updatedData: { name?: string; image?: string } = {};

//       if (existingUser.name !== name) updatedData.name = name;
//       if (existingUser.image !== image) updatedData.image = image;

//       if (Object.keys(updatedData).length > 0) {
//         await User.updateOne(
//           { _id: existingUser._id },
//           { $set: updatedData }
//         ).session(session);
//       }
//     }

//     const existingAccount = await Account.findOne({
//       userId: existingUser._id,
//       provider,
//       providerAccountId,
//     }).session(session);

//     if (!existingAccount) {
//       await Account.create(
//         [
//           {
//             userId: existingUser._id,
//             name,
//             image,
//             provider,
//             providerAccountId,
//           },
//         ],
//         { session }
//       );
//     }

//     await session.commitTransaction();

//     return NextResponse.json({ success: true });
//   } catch (error: unknown) {
//     await session.abortTransaction();
//     return handleError(error, "api") as APIErrorResponse;
//   } finally {
//     session.endSession();
//   }
// }
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

// POST /api/auth/oauth-signin
export async function POST(request: Request) {
  console.log("📥 OAuth sign-in endpoint hit");

  let session: mongoose.ClientSession | null = null;

  try {
    const body = await request.json();
    const { provider, providerAccountId, user } = body;

    // Validate incoming request body
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      console.error(
        "❌ Validation failed:",
        validatedData.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Validation failed",
            details: validatedData.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { name, username, email, image } = user;
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();

    // Check or create user
    let existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
          },
        ],
        { session }
      );
    } else {
      const updates: { name?: string; image?: string } = {};
      if (existingUser.name !== name) updates.name = name;
      if (existingUser.image !== image) updates.image = image;

      if (Object.keys(updates).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updates }
        ).session(session);
      }
    }

    // Check or create account link
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    console.log("✅ OAuth sign-in completed for user:", email);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if (session) await session.abortTransaction();
    console.error("❌ OAuth sign-in error:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "Internal Server Error" },
      },
      { status: 500 }
    );
  } finally {
    session?.endSession();
  }
}
