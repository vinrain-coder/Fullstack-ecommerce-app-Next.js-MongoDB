import { auth } from "@/auth";
import AddToCart from "@/components/shared/product/add-to-cart";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProductsByCategory,
} from "@/lib/actions/product.actions";

import ReviewList from "./review-list";
import { generateId, round2 } from "@/lib/utils";
import SelectVariant from "@/components/shared/product/select-variant";
import ProductPrice from "@/components/shared/product/product-price";
import ProductGallery from "@/components/shared/product/product-gallery";
import AddToBrowsingHistory from "@/components/shared/product/add-to-browsing-history";
import { Separator } from "@/components/ui/separator";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import RatingSummary from "@/components/shared/product/rating-summary";
import ProductSlider from "@/components/shared/product/product-slider";
import { getTranslations } from "next-intl/server";
import { getSetting } from "@/lib/actions/setting.actions";
import ShareProduct from "@/components/shared/product/share-product";
import WishlistButton from "@/components/shared/product/wishlist-button";
import SubscribeButton from "@/components/shared/product/stock-subscription-button";
import OrderViaWhatsApp from "@/components/shared/product/order-via-whatsapp";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.slice(0, 100).map((slug) => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  // const t = await getTranslations();
  if (!product) {
    return { title: "Product Not Found" };
  }

  const ogImageUrl = product.images[0];
  const { site } = await getSetting();

  return {
    title: product.name,
    description:
      product.description || "Check out this amazing product at ShoePedi!",
    openGraph: {
      title: product.name,
      description: product.description || "Discover this product on ShoePedi!",
      url: `${site.url}/product/${product.slug}`,
      siteName: "ShoePedi",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      price: {
        amount: product.price.toString(),
        currency: "KES",
      },
    },
    twitter: {
      card: "summary_large_image",
      site: "@ShoePedi",
      creator: "@ShoePedi",
      title: product.name,
      description: product.description || "Discover this product on ShoePedi!",
      images: [ogImageUrl],
    },
    additionalMetaTags: [
      { property: "product:price:amount", content: product.price.toString() },
      { property: "product:price:currency", content: "KES" },
    ],
    jsonLd: {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: ogImageUrl,
      description: product.description,
      brand: { "@type": "Brand", name: "ShoePedi" },
      offers: {
        "@type": "Offer",
        url: `${site.url}/product/${product.slug}`,
        priceCurrency: "KES",
        price: product.price.toString(),
      },
    },
  };
}

export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string; color?: string; size?: string };
}) {
  const { slug } = params;
  const session = await auth();
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id.toString(),
    page: Number(searchParams.page || "1"),
  });

  const t = await getTranslations();

  return (
    <div>
      <AddToBrowsingHistory
        id={product._id.toString()}
        category={product.category}
      />

      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-2">
            <ProductGallery
              images={product.images}
              colors={product.colors}
              selectedColor={searchParams.color || product.colors[0]}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-4 md:p-5">
            <div className="flex flex-col gap-3">
              <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
                {t("Product.Brand")} {product.brand} {product.category}
              </p>
              <h1 className="font-bold text-lg lg:text-xl">{product.name}</h1>

              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                asPopover
                ratingDistribution={product.ratingDistribution}
              />
              <Separator />
              <div className="flex gap-3">
                <ProductPrice
                  price={product.price}
                  listPrice={product.listPrice}
                  isDeal={product.tags.includes("todays-deal")}
                  forListing={false}
                />
              </div>
            </div>

            <SelectVariant
              product={product}
              size={searchParams.size || product.sizes[0]}
              color={searchParams.color || product.colors[0]}
            />

            <Separator className="my-2" />
            <p className="p-bold-20 text-grey-600">
              {t("Product.Description")}:
            </p>
            <p className="p-medium-16 lg:p-regular-18">{product.description}</p>
          </div>

          <div>
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                <ProductPrice price={product.price} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className="text-destructive font-bold">
                    Only a few left in stock - order soon
                  </div>
                )}

                <div
                  className={
                    product.countInStock !== 0
                      ? "text-green-700 text-xl"
                      : "text-destructive text-xl"
                  }
                >
                  {product.countInStock !== 0
                    ? t("Product.In Stock")
                    : t("Product.Out of Stock")}
                </div>

                {product.countInStock !== 0 ? (
                  <div className="flex flex-col gap-2 items-center">
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id.toString(),
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        size: searchParams.size || product.sizes[0],
                        color: searchParams.color || product.colors[0],
                      }}
                    />
                    <OrderViaWhatsApp
                      productName={product.name}
                      variant={searchParams.color || product.colors[0]}
                      size={searchParams.size || product.sizes[0]}
                      quantity={1}
                      price={product.price}
                    />
                    <WishlistButton
                      productId={product._id.toString()}
                      initialWishlist={[]}
                    />
                  </div>
                ) : (
                  <SubscribeButton productId={product._id.toString()} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="my-2">
        <h3 className="font-semibold">Share this product</h3>
        <ShareProduct slug={product.slug} name={product.name} />
      </div>

      <ReviewList product={product} userId={session?.user.id} />

      <ProductSlider
        products={relatedProducts.data}
        title={t("Product.Best Sellers in", { name: product.category })}
      />

      <BrowsingHistoryList className="mt-10" />
    </div>
  );
}
