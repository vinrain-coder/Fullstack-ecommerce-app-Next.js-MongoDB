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
import { sendVerificationEmail, sendWelcomeEmail } from "@/emails";
import crypto from "crypto";

// 📌 Register New User
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync(userSignUp);
    await connectToDatabase();

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return { success: false, error: "Email is already registered." };
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await User.create({
      ...user,
      password: hashedPassword,
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours Expiry
    });

    await sendVerificationEmail(newUser.email, newUser.verificationToken);
    return {
      success: true,
      message: "User registered. Check email to verify.",
    };
  } catch (error) {
    return { success: false, error: "Registration failed. Please try again." };
  }
}

// 📌 Verify Email
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

  // Send Welcome Email
  await sendWelcomeEmail(user.email, user.name);

  // Auto Sign-In After Verification
  const signInResponse = await signIn("credentials", {
    email: user.email,
    password: user.password,
    redirect: false, // Prevent auto-redirect issues
  });

  if (!signInResponse.ok) {
    return {
      success: false,
      message: "Verification successful, but auto-login failed.",
    };
  }

  return { success: true, message: "Email verified. You are now logged in." };
}

// 📌 Handle Google Sign-In
export const handleGoogleUser = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "No user session found" };
  }

  await connectToDatabase();

  let existingUser = await User.findOne({ email: session.user.email });

  if (!existingUser) {
    existingUser = await User.create({
      name: session.user.name || "Google User", // Prevent undefined names
      email: session.user.email,
      password: null, // Google users don't have a password
      emailVerified: true,
    });

    try {
      await sendWelcomeEmail(existingUser.email, existingUser.name);
      console.log(`✅ Welcome email sent to ${existingUser.email}`);
    } catch (error) {
      console.error("❌ Error sending welcome email:", error);
      return { success: false, error: "Failed to send welcome email" };
    }
  }

  return { success: true };
};

// 📌 Delete User
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

// 📌 Update User
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

// 📌 Update User Name
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

// 📌 Sign-In With Credentials
export async function signInWithCredentials(user: IUserSignIn) {
  try {
    const response = await signIn("credentials", { ...user, redirect: false });
    if (!response.ok) throw new Error("Invalid email or password.");
    return response;
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// 📌 Sign Out
export const SignOut = async () => {
  try {
    const redirectTo = await signOut({ redirect: false });
    redirect(redirectTo.redirect);
  } catch (error) {
    console.error("❌ Error signing out:", error);
    return { success: false, message: "Failed to sign out." };
  }
};

// 📌 Get All Users (Paginated)
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number;
  page: number;
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

// 📌 Get User By ID
export async function getUserById(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return JSON.parse(JSON.stringify(user)) as IUser;
}
