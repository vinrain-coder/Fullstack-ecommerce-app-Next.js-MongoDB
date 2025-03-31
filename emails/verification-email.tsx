import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type VerificationEmailProps = {
  verificationLink: string;
};

export default function VerificationEmail({
  verificationLink,
}: VerificationEmailProps) {
  return (
    <Html>
      <Preview>Verify your email for ShoePedi</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-100">
          <Container className="max-w-lg bg-white rounded-lg shadow-lg p-6">
            <Heading className="text-2xl font-bold text-center text-gray-900">
              Verify Your Email
            </Heading>
            <Section className="text-center">
              <Text className="text-gray-700 text-lg">
                You&apos;re receiving this email because you used this email to
                sign up for a <strong>ShoePedi</strong> account.
              </Text>
              <Button
                href={verificationLink}
                className="bg-orange-500 text-white px-6 py-3 mt-4 rounded-lg text-xl font-bold shadow-md transition hover:bg-orange-600"
              >
                Verify Email
              </Button>
              <Text className="text-gray-600 mt-4 text-sm">
                If you didn’t request this, you can safely ignore this email.
                This link will expire in <strong>24 hours</strong>.
              </Text>
              <Text className="text-gray-600 text-sm mt-2">
                Need help?{" "}
                <a
                  href="mailto:support@shoepedi.com"
                  className="text-blue-500 underline"
                >
                  Contact Support
                </a>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
