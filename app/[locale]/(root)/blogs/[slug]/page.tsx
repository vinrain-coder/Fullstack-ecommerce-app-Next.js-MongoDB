//@ts-nocheck
"use client";

import { notFound } from "next/navigation";
import { getBlogBySlug, incrementBlogViews } from "@/lib/actions/blog.actions";
import { IBlog } from "@/lib/db/models/blog.model";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      const fetchedBlog = await getBlogBySlug(params.slug);
      if (!fetchedBlog) {
        notFound();
        return;
      }
      setBlog(fetchedBlog);
      incrementBlogViews(params.slug);
      setLoading(false);
    }
    fetchBlog();
  }, [params.slug]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return notFound();

  // ✅ Format Date
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* ✅ Dynamically Update Metadata */}
      <title>{blog.title}</title>
      <meta name="description" content={blog.content.slice(0, 160)} />

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-600">
          By ShoePedi • {formatDate(blog.publishedAt)} • 👀 {blog.views} views
        </p>

        <article className="prose max-w-none mt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </article>
      </div>
    </>
  );
}
