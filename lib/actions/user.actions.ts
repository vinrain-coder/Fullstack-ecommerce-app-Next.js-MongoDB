"use server";

import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { IUserName, IUserSignUp } from "@/types";
import { UserSignUpSchema, UserUpdateSchema } from "../validator";
import { connectToDatabase } from "../db";
import User, { IUser } from "../db/models/user.model";
import { formatError } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toast } from "sonner";
import { getSetting } from "./setting.actions";
import { validateRequest } from "../arcjet";

// ✅ Register User with Arcjet Protection
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync(userSignUp);

    // Arcjet Protection
    const protection = await validateRequest(user.email);
    if (!protection.success) return protection; // Return error object to frontend

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

// ✅ Sign In with Credentials and Arcjet Protection
export async function signInWithCredentials(user: {
  email: string;
  password: string;
}) {
  const protection = await validateRequest(user.email);
  if (!protection.success) return protection; // Return error object

  return await signIn("credentials", { ...user, redirect: false });
}

// ✅ Sign In with Google
export const SignInWithGoogle = async () => {
  await signIn("google");
  toast.success("Signed in with Google!");
};

// ✅ Sign Out
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  toast.success("Signed out successfully!");
  redirect(redirectTo.redirect);
};

// ✅ Delete User
export async function deleteUser(id: string) {
  try {
    await connectToDatabase();
    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error("User not found");

    revalidatePath("/admin/users");
    toast.success("User deleted successfully!");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    const errorMessage = formatError(error);
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  }
}

// ✅ Update User (Admin)
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

    toast.success("User updated successfully!");
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    const errorMessage = formatError(error);
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  }
}

// ✅ Update User Name (For Profile)
export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase();
    const session = await auth();
    const currentUser = await User.findById(session?.user?.id);
    if (!currentUser) throw new Error("User not found");

    currentUser.name = user.name;
    const updatedUser = await currentUser.save();

    toast.success("User name updated successfully!");
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    const errorMessage = formatError(error);
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  }
}

// ✅ Get All Users
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
  const skipAmount = (page - 1) * limit;
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

// ✅ Get User by ID
export async function getUserById(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return JSON.parse(JSON.stringify(user)) as IUser;
}
