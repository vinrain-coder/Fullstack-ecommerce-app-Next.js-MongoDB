import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { IProduct } from "@/lib/db/models/product.model";

type StockSubscriptionEmailProps = {
  product: IProduct;
  email: string;
  siteUrl: string;
};

export default function StockSubscriptionNotificationEmail({
  product,
  email,
  siteUrl,
}: StockSubscriptionEmailProps) {
  return (
    <Html>
      <Preview>{`"${product.name}" is back in stock!`}</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading className="text-2xl font-bold text-center text-gray-900">
              {`"${product.name}" is back in stock!`}
            </Heading>

            <Section className="text-center">
              <Row>
                <Column>
                  <Link href={`${siteUrl}/product/${product.slug}`}>
                    <Img
                      width="150"
                      alt={product.name}
                      className="rounded mx-auto"
                      src={
                        product.images[0] || "https://via.placeholder.com/150"
                      }
                    />
                  </Link>
                </Column>
              </Row>
              <Text className="text-gray-600 mt-4">
                The product you subscribed to is now available for purchase.
                Don’t miss out before it sells out again!
              </Text>
              <Button
                href={`${siteUrl}/product/${product.slug}`}
                className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-md text-lg font-bold"
              >
                Buy Now
              </Button>
            </Section>

            <Section className="mt-6 text-center border-t pt-4">
              <Text className="text-gray-500 text-sm">
                You received this email because you subscribed to be notified
                when this product is back in stock.
              </Text>
              <Text className="text-gray-500 text-sm">
                If you no longer wish to receive these notifications, you can{" "}
                <Link
                  href={`${siteUrl}/unsubscribe?email=${email}&product=${product._id}`}
                  className="text-blue-600"
                >
                  unsubscribe here
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
