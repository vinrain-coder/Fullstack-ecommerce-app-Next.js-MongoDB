import {
  Body,
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

import { IOrder } from "@/lib/db/models/order.model";
import { getSetting } from "@/lib/actions/setting.actions";

type OrderInformationProps = {
  order: IOrder;
};

PurchaseReceiptEmail.PreviewProps = {
  order: {
    _id: "123",
    isPaid: true,
    paidAt: new Date(),
    totalPrice: 100,
    itemsPrice: 100,
    taxPrice: 0,
    shippingPrice: 0,
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "New York",
      postalCode: "12345",
      country: "USA",
      phone: "123-456-7890",
      province: "New York",
    },
    items: [
      {
        clientId: "123",
        name: "Product 1",
        image: "https://via.placeholder.com/150",
        price: 100,
        quantity: 1,
        product: "123",
        slug: "product-1",
        category: "Category 1",
        countInStock: 10,
      },
    ],
    paymentMethod: "PayPal",
    expectedDeliveryDate: new Date(),
    isDelivered: true,
  } as IOrder,
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  const { site } = await getSetting();
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white text-gray-800">
          <Container className="max-w-4xl mx-auto px-4">
            <Heading className="text-3xl font-bold text-center text-golden-600 my-6">
              Purchase Receipt
            </Heading>
            <Section>
              <Row className="flex flex-wrap">
                <Column className="w-full sm:w-1/3">
                  <Text className="mb-1 text-gray-500">Order ID</Text>
                  <Text className="font-semibold">{order._id.toString()}</Text>
                </Column>
                <Column className="w-full sm:w-1/3">
                  <Text className="mb-1 text-gray-500">Purchased On</Text>
                  <Text className="font-semibold">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column className="w-full sm:w-1/3">
                  <Text className="mb-1 text-gray-500">Price Paid</Text>
                  <Text className="font-semibold">
                    Ksh.{order.totalPrice}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="border border-solid border-gray-200 rounded-lg p-4 my-6">
              {order.items.map((item) => (
                <Row key={item.product} className="flex flex-wrap items-center mb-4">
                  <Column className="w-20">
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Img
                        width="80"
                        alt={item.name}
                        className="rounded shadow-sm"
                        src={
                          item.image.startsWith("/")
                            ? `${site.url}${item.image}`
                            : item.image
                        }
                      />
                    </Link>
                  </Column>
                  <Column className="flex-1 text-left">
                    <Link href={`${site.url}/product/${item.slug}`}>
                      <Text className="font-semibold text-lg">{item.name} x {item.quantity}</Text>
                    </Link>
                  </Column>
                  <Column align="right" className="text-right">
                    <Text className="font-semibold">Ksh.{item.price}</Text>
                  </Column>
                </Row>
              ))}

              {[
                { name: "Items", price: order.itemsPrice },
                { name: "Tax", price: order.taxPrice },
                { name: "Shipping", price: order.shippingPrice },
                { name: "Total", price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-2">
                  <Column align="right" className="font-semibold text-right">
                    {name}:
                  </Column>
                  <Column align="right" className="text-right">
                    <Text className="m-0">Ksh.{price}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Section className="text-center py-4">
              <Text className="text-sm text-gray-500">
                Thank you for shopping with us!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
