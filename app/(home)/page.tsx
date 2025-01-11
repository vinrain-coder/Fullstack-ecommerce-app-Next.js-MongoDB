import { HomeCard } from "@/components/shared/home/home-card";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import {
  getAllCategories,
  getProductsForCard,
} from "@/lib/actions/product.actions";
import data from "@/lib/data";
import { toSlug } from "@/lib/utils";

export default async function Page() {
  const categories = (await getAllCategories()).slice(0, 4);
  const newArrivals = await getProductsForCard({
    tag: "new-arrival",
    limit: 4,
  });
  const featured = await getProductsForCard({
    tag: "featured",
    limit: 4,
  });
  const bestSellers = await getProductsForCard({
    tag: "best-seller",
    limit: 4,
  });
  const cards = [
    {
      title: "Categories to explore",
      link: {
        text: "See more",
        href: "/search",
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: "Explore new arrivals",
      items: newArrivals,
      link: {
        text: "View all",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Discover best sellers",
      items: bestSellers,
      link: {
        text: "View all",
        href: "/search?tag=new-arrival",
      },
    },
    {
      title: "Featured products",
      items: featured,
      link: {
        text: "View all",
        href: "/search?tag=new-arrival",
      },
    },
  ];
  return (
    <>
      <HomeCarousel items={data.carousels} />;
      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />
      </div>
    </>
  );
}
