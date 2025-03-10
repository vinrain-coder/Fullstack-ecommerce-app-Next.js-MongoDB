"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProduct } from "@/lib/db/models/product.model";
import Rating from "./rating";
import { formatNumber, generateId, round2 } from "@/lib/utils";
import ProductPrice from "./product-price";
import ImageHover from "./image-hover";
import AddToCart from "./add-to-cart";
import WishlistIcon from "./wishlist-icon";
import { useWishlist } from "@/hooks/use-wishlist";

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  product: IProduct;
  hideDetails?: boolean;
  hideBorder?: boolean;
  hideAddToCart?: boolean;
}) => {
  const ProductImage = () => (
    <div className="relative h-52">
      <Link href={`/product/${product.slug}`}>
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className="relative h-52">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
        )}
      </Link>
      <div
        className="absolute top-1 right-1"
        onClick={(e) => e.stopPropagation()} // Stop event bubbling
      >
        <WishlistIcon productId={product._id} />
      </div>
    </div>
  );

  const ProductDetails = () => (
    <div className="flex-1 space-y-2">
      <p className="font-bold">{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className="overflow-hidden text-ellipsis"
      >
        {product.name}
      </Link>
      <div className="flex gap-2 justify-center">
        <Rating rating={product.avgRating} />
        <span>({formatNumber(product.numReviews)})</span>
      </div>
      <ProductPrice
        isDeal={product.tags.includes("todays-deal")}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  );

  const AddButton = () => (
    <div className="w-full text-center">
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  );

  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage />
      {!hideDetails && <ProductDetails />}
      {!hideAddToCart && <AddButton />}
    </div>
  ) : (
    <Card className="flex flex-col">
      <CardHeader className="p-3">
        <ProductImage />
      </CardHeader>
      <CardContent className="p-3 flex-1 text-center">
        {!hideDetails && <ProductDetails />}
      </CardContent>
      {!hideAddToCart && (
        <CardFooter className="p-3">
          <AddButton />
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
