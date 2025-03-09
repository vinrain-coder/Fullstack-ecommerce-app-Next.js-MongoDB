import { getAllBlogs } from "@/lib/actions/blog.actions";
import BlogCard from "@/components/shared/blog/blog-card";
import MostViewedBlogs from "@/components/shared/blog/most-viewed";

export default async function BlogPage({
  searchParams = {},
}: {
  searchParams?: Record<string, string>;
}) {
  // ✅ Ensure `page` is safely parsed
  // const page = Number(searchParams.page) || 1;

  // ✅ Fetch blogs with proper serialization
  const blogs = await getAllBlogs({});

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Latest Blogs Section */}
      <div className="bg-card grid md:grid-cols-5 md:gap-4">
        <div className="md:col-span-4 space-y-4">
          <div>
            <h1 className="font-bold text-2xl">Latest Blogs</h1>
            <p className="text-gray-600">
              Explore our latest blogs and articles
            </p>
          </div>

          {/* ✅ Blog List */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs.length === 0 ? (
              <p>No blogs found.</p>
            ) : (
              blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
            )}
          </div>
        {/* <div className="">
          <MostViewedBlogs />
        </div> */}
        </div>

      </div>
    </div>
  );
}
