import { getSetting } from "@/lib/actions/setting.actions";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import SocialLinks from "./social-links";

type WelcomeEmailProps = {
  name: string;
};

export default async function WelcomeEmail({ name }: WelcomeEmailProps) {
  const { site } = await getSetting();

  return (
    <Html>
      <Preview>
        Welcome to ShoePedi, {name}! Enjoy 10% Off Your First Order 🎉
      </Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-xl bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <Heading className="text-2xl font-bold text-center text-gray-900">
              Welcome to ShoePedi, {name}! 🎉
            </Heading>

            {/* Message */}
            <Section className="text-center">
              <Text className="text-gray-700 mt-4 text-lg">
                We’re thrilled to have you as part of our ShoePedi family! 🎊
                Discover the latest styles in footwear, bags, and fashion
                accessories.
              </Text>
              <Text className="text-gray-900 font-semibold text-lg mt-4">
                🎁 Enjoy up to **40% OFF**!
              </Text>
              <Text className="text-gray-600 text-sm mt-6">
                Check out our
                <Link
                  href={`${site.url}/search?tag=todays-deal`}
                  className="text-blue-600 font-semibold"
                >
                  Offers
                </Link>
                .
              </Text>

              {/* Shop Now Button */}
              <Button
                href={site.url}
                className="bg-orange-500 text-white px-6 py-3 mt-6 rounded-xl text-lg font-bold shadow-md transition text-center"
              >
                Shop Now & Save
              </Button>

              {/* Browse Bestsellers */}
              <Text className="text-gray-600 text-sm mt-6">
                Looking for inspiration? Check out our
                <Link
                  href={`${site.url}/search?tag=best-seller`}
                  className="text-blue-600 font-semibold"
                >
                  Bestsellers
                </Link>
                .
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center border-t pt-4">
              <Text className="text-gray-500 text-sm">
                Have questions?{" "}
                <Link
                  href={`${site.url}/page/contact-us`}
                  className="text-blue-600"
                >
                  Contact our support team
                </Link>
                .
              </Text>
              <SocialLinks />
              <Text className="text-gray-400 text-xs mt-4">
                {site.name} | {site.copyright}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
