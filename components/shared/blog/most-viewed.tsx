import { getMostViewedBlogs } from "@/lib/actions/blog.actions";
import Link from "next/link";

export default async function MostViewedBlogs() {
  const blogs = await getMostViewedBlogs();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">🔥Most Viewed Blogs</h2>
      <ul className="mt-4 space-y-3">
        {blogs.map((blog) => (
          <li key={blog.slug} className="flex space-x-4">
            <img src={blog.category} alt={blog.title} className="w-16 h-16 object-cover rounded" />
            <div>
              <Link href={`/blog/${blog.slug}`} className="text-blue-500 hover:underline">
                {blog.title}
              </Link>
              <p className="text-gray-500 text-sm">👀 {blog.views} views</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
