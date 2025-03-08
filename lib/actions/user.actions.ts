"use server";

import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { IUserName, IUserSignIn, IUserSignUp } from "@/types";
import { UserSignUpSchema, UserUpdateSchema } from "../validator";
import { connectToDatabase } from "../db";
import User, { IUser } from "../db/models/user.model";
import { formatError } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSetting } from "./setting.actions";
import { request } from "@arcjet/next";
import { handleArcjetDecision } from "@/lib/arcjet";
import { arcjetInstance } from "../arcjetInstance";

// CREATE

// ✅ Fix: Ensure handleArcjetDecision is awaited
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });

    // Arcjet Protection
    const req = await request();
    const decision = await arcjetInstance.protect(req, { email: user.email });
    const protection = await handleArcjetDecision(decision); // ✅ Add "await"
    if (!protection.success) return protection;

    await connectToDatabase();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

// ✅ Fix: Ensure handleArcjetDecision is awaited
export async function signInWithCredentials(user: {
  email: string;
  password: string;
}) {
  const req = await request();
  const decision = await arcjetInstance.protect(req, { email: user.email });
  const protection = await handleArcjetDecision(decision); // ✅ Add "await"
  if (!protection.success) return protection;

  return await signIn("credentials", { ...user, redirect: false });
}


// DELETE

export async function deleteUser(id: string) {
  try {
    await connectToDatabase();
    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error("Use not found");
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
// UPDATE

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase();
    const dbUser = await User.findById(user._id);
    if (!dbUser) throw new Error("User not found");
    dbUser.name = user.name;
    dbUser.email = user.email;
    dbUser.role = user.role;
    const updatedUser = await dbUser.save();
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase();
    const session = await auth();
    const currentUser = await User.findById(session?.user?.id);
    if (!currentUser) throw new Error("User not found");
    currentUser.name = user.name;
    const updatedUser = await currentUser.save();
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// // Sign in with Arcjet Protection
// export async function signInWithCredentials(user: {
//   email: string;
//   password: string;
// }) {
//   const req = await request();
//   const decision = await arcjetInstance.protect(req, { email: user.email });
//   const protection = handleArcjetDecision(decision);
//   if (!protection.success) return protection;

//   return await signIn("credentials", { ...user, redirect: false });
// }

export const SignInWithGoogle = async () => {
  await signIn("google");
};
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};

// GET
export async function getAllUsers({
  limit,
  page,
  search,
}: {
  limit?: number;
  page: number;
  search?: string;
}) {
  const {
    common: { pageSize },
  } = await getSetting();
  limit = limit || pageSize;
  await connectToDatabase();

  const skipAmount = (Number(page) - 1) * limit;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(query)
    .sort({ createdAt: "asc" })
    .skip(skipAmount)
    .limit(limit);

  const usersCount = await User.countDocuments(query);

  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  };
}

export async function getUserById(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return JSON.parse(JSON.stringify(user)) as IUser;
}
