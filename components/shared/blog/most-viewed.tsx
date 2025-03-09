import { getMostViewedBlogs } from "@/lib/actions/blog.actions";
import BlogCard from "@/components/shared/blog/blog-card";

export default async function MostViewedBlogs() {
  const blogs = await getMostViewedBlogs();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">🔥 Most Viewed Blogs</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
