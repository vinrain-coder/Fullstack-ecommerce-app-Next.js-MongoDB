"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import useSettingStore from "@/hooks/use-setting-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IUserSignUp } from "@/types";
import { registerUser } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignUpSchema } from "@/lib/validator";
import { Separator } from "@/components/ui/separator";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function CredentialsSignUpForm() {
  const {
    setting: { site },
  } = useSettingStore();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = async (data: IUserSignUp) => {
    try {
      setLoading(true);

      const res = await registerUser(data);

      if (!res.success) {
        toast.error(res.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success(
        "Account created successfully! Check your email to verify."
      );
      setEmailSent(true);
      reset(); // Reset form fields
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <MailCheck className="w-16 h-16 text-green-500" />
        <h2 className="text-xl font-bold text-center">
          Check your email to verify your account
        </h2>
        <p className="text-gray-600 text-center">
          We’ve sent a confirmation link to your email. Please check your inbox
          and follow the instructions to complete your registration.
        </p>
        <Link href="/sign-in">
          <Button className="w-full">Go to Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-sm text-center text-gray-600">
            By creating an account, you agree to {site.name}&apos;s{" "}
            <Link
              href="/page/conditions-of-use"
              className="text-blue-500 hover:underline"
            >
              Conditions of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/page/privacy-policy"
              className="text-blue-500 hover:underline"
            >
              Privacy Notice
            </Link>
            .
          </p>

          <Separator className="mb-4" />

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link
              className="text-blue-500 hover:underline"
              href={`/sign-in?callbackUrl=${callbackUrl}`}
            >
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
