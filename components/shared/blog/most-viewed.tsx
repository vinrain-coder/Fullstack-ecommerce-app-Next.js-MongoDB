
import { getMostViewedBlogs } from "@/lib/actions/blog.actions";
import BlogCard from "@/components/shared/blog/blog-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default async function MostViewedBlogs() {
  const blogs = await getMostViewedBlogs(); // Fetch most viewed blogs
  const displayedBlogs = blogs.slice(0, 4); // Limit to max 4 blogs

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Our Popular Stories</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-4"
      >
        <CarouselContent>
          {displayedBlogs.map((blog) => (
            <CarouselItem
              key={blog._id}
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
        <Link
          href="/blogs"
          className="text-primary font-medium hover:underline"
        >
          View All Blogs →
        </Link>
      </div>
    </div>
  );
}
