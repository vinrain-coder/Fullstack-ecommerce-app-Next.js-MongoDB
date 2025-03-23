import { getSetting } from "@/lib/actions/setting.actions";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  name: string;
};

export default async function WelcomeEmail({ name }: WelcomeEmailProps) {
  const { site } = await getSetting();

  return (
    <Html>
      <Preview>Welcome to Shoepedi, {name}! 🎉</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-xl bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <Heading className="text-2xl font-bold text-center text-gray-900">
              Welcome to Shoepedi, {name}! 🎉
            </Heading>

            {/* Message */}
            <Section className="text-center">
              <Text className="text-gray-700 mt-4 text-lg">
                Thank you for joining Shoepedi. We’re excited to have you on
                board! Start exploring the best shoes and fashion accessories
                today.
              </Text>
              {/* Shop Now Button */}
              <Button
                href={site.url}
                className="bg-orange-500 text-white px-6 py-3 mt-6 rounded-xl text-lg font-bold shadow-md transition text-center"
              >
                Start Shopping
              </Button>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center border-t pt-4">
              <Text className="text-gray-500 text-sm">
                If you have any questions, feel free to{" "}
                <Link
                  href={`${site.url}/page/contact-us`}
                  className="text-blue-600"
                >
                  contact us
                </Link>
                .
              </Text>
              <Img
                src={`${site.url}${site.logo}`}
                alt={site.name}
                className="mt-4"
                width={120}
                height={50}
              />
              <Text className="text-gray-400 text-xs mt-4">
                {site.name} . {site.copyright}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
