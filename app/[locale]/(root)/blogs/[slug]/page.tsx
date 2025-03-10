import { notFound } from "next/navigation";
import { getBlogBySlug, incrementBlogViews } from "@/lib/actions/blog.actions";
import { IBlog } from "@/lib/db/models/blog.model";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MostViewedBlogs from "@/components/shared/blog/most-viewed";
import { Separator } from "@/components/ui/separator";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const blog: IBlog | null = await getBlogBySlug(params.slug);

  if (!blog) return notFound();

  // Increment views (fire & forget)
  incrementBlogViews(params.slug);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentPage = Number(searchParams.page || "1");

  return (
    <>
      <title>{blog.title}</title>
      <meta name="description" content={blog.content.slice(0, 160)} />

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-600">
          By ShoePedi • {formatDate(blog.createdAt)} • 👀 {blog.views} views
        </p>

        <article className="prose max-w-none mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </article>

        <div className="mt-3 flex gap-2 text-xs justify-between">
          <span>Published in: {blog.category}</span>
          <span>
            Tags: {Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags}
          </span>
        </div>

        <Separator className="my-4" />
        {/* <MostViewedBlogs /> */}
      </div>
    </>
  );
}
