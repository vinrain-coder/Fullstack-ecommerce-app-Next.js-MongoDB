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
import { sendWelcomeEmail } from "@/emails";

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
<<<<<<< HEAD
<<<<<<< HEAD
    const user = await UserSignUpSchema.parseAsync(userSignUp);

    await connectToDatabase();
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
    });

    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    return {
      success: true,
      message: "User registered. Check email to verify.",
    };
=======
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });

    await connectToDatabase();
    const newUser = await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });

=======
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });

    await connectToDatabase();
    const newUser = await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });

>>>>>>> parent of e5fb598 (Implement email verification)
    // Send welcome email
    await sendWelcomeEmail(newUser.email, newUser.name);

    return { success: true, message: "User created successfully" };
<<<<<<< HEAD
>>>>>>> parent of e5fb598 (Implement email verification)
=======
>>>>>>> parent of e5fb598 (Implement email verification)
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// 📌 Verify Email
=======
// verify email
>>>>>>> parent of b3cda32 (edit form)
export async function verifyEmail(token: string) {
  await connectToDatabase();
  const user = await User.findOne({ verificationToken: token });

  if (
    !user ||
    !user.verificationTokenExpires ||
    user.verificationTokenExpires < Date.now()
  ) {
    return { success: false, message: "Invalid or expired token" };
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  // Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  // Automatically sign in after verification
  await signIn("credentials", { email: user.email, password: user.password });

  return { success: true, message: "Email verified. You are now logged in." };
}

<<<<<<< HEAD
// 📌 Handle Google Sign-In
=======
=======
>>>>>>> parent of e5fb598 (Implement email verification)
// Google Sign-In: Send Welcome Email If It's the First Time
>>>>>>> parent of e5fb598 (Implement email verification)
=======
// Google Sign-In: Send Welcome Email If It's the First Time
>>>>>>> parent of b3cda32 (edit form)
export const handleGoogleUser = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "No user session found" };
  }

  await connectToDatabase();

  let existingUser = await User.findOne({ email: session.user.email });

  if (!existingUser) {
    existingUser = await User.create({
      name: session.user.name,
      email: session.user.email,
<<<<<<< HEAD
<<<<<<< HEAD
      password: null, // Google users don't have a password
      emailVerified: true,
=======
      password: null, // No password for Google sign-in users
<<<<<<< HEAD
>>>>>>> parent of e5fb598 (Implement email verification)
=======
>>>>>>> parent of e5fb598 (Implement email verification)
=======
      password: null, // No password for Google sign-in users
      emailVerified: true, // Google users are automatically verified
>>>>>>> parent of b3cda32 (edit form)
    });

    try {
      await sendWelcomeEmail(existingUser.email, existingUser.name);
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  }

  return { success: true };
};

// DELETE
export async function deleteUser(id: string) {
  try {
    await connectToDatabase();
    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error("User not found");
    revalidatePath("/admin/users");
    return { success: true, message: "User deleted successfully" };
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

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn("credentials", { ...user, redirect: false });
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};

// GET
export async function getAllUsers({
  limit,
  page,
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
  const users = await User.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(limit);
  const usersCount = await User.countDocuments();
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
