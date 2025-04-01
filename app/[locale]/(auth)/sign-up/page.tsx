import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SignUpForm from "./signup-form";
import { GoogleSignInForm } from "../sign-in/google-signin-form";
import SeparatorWithOr from "@/components/shared/separator-or";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/lib/actions/setting.actions";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { site } = await getSetting();

  const { callbackUrl } = searchParams;

  const session = await auth();
  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <SignUpForm /> */}
          <GoogleSignInForm />
        </CardContent>
      </Card>

      <SeparatorWithOr>Existing customer?</SeparatorWithOr>

      <Link href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className="w-full" variant="outline">
          Sign in to your {site.name} account
        </Button>
      </Link>
    </div>
  );
}
