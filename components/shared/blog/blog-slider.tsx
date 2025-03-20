"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlogCard from "./blog-card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function BlogSlider({
  title,
  blogs,
}: {
  title?: string;
  blogs: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string | Date;
  }[];
}) {
  const displayedBlogs = blogs.slice(0, 4); // Limit to max 4 blogs

  return (
    <div className="w-full">
      <Separator className={cn("mb-4")} />
      {title && <h2 className="h2-bold mb-5">{title}</h2>}
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {displayedBlogs.map((blog) => (
            <CarouselItem
              key={blog._id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <BlogCard blog={blog} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/* View All Blogs Link */}
      <div className="mt-6 text-center">
        <Link href="/blogs" className="font-medium hover:underline">
          View All Blogs →
        </Link>
      </div>
    </div>
  );
}
