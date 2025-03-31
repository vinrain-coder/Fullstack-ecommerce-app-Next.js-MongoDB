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
                🎁 Enjoy **10% OFF** your first order!
              </Text>
              <Text className="text-gray-700">
                Use code **WELCOME10** at checkout. Don&apos;t miss out on our
                hottest deals!
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
                  href={`${site.url}/search?category=BestSellers`}
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
              <Text className="text-gray-500 text-sm mt-4">
                Follow us for the latest drops & deals:
                <Link
                  href="https://www.instagram.com/shoepedi"
                  className="text-blue-600 ml-1"
                >
                  Instagram
                </Link>
                |
                <Link
                  href="https://www.tiktok.com/@shoepedi"
                  className="text-blue-600 ml-1"
                >
                  TikTok
                </Link>
              </Text>
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
