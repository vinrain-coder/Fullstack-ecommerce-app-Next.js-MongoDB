//@ts-nocheck
"use client";

import { notFound } from "next/navigation";
import { getBlogBySlug, incrementBlogViews } from "@/lib/actions/blog.actions";
import { IBlog } from "@/lib/db/models/blog.model";
import ReactMarkdown from "react-markdown";
import { getTranslations } from "next-intl/server";
import { useEffect } from "react";
import MostViewedBlogs from "@/components/shared/blog/most-viewed";
import remarkGfm from "remark-gfm";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return { title: params.slug.replaceAll("-", " ") }; 
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog: IBlog | null = await getBlogBySlug(params.slug);

  const t = await getTranslations();

  if (!blog) return notFound();

  useEffect(() => {
    incrementBlogViews(params.slug);
  }, [params.slug]);

  const formatDateTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Title & Metadata */}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-600">
        {t("Blog.By")} <span className="font-semibold">ShoePedi</span> •{" "}
        {formatDateTime(blog.publishedAt)} • 👀 {blog.views} views
      </p>

      {/* Categories & Tags */}
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-gray-200 rounded">{blog.category}</span>
        {blog.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-gray-100 rounded">
            {tag}
          </span>
        ))}
      </div>

      {/* Blog Content */}
      <article className="prose max-w-none mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </article>
      <div className="container mx-auto p-6">
        <MostViewedBlogs />
      </div>
    </div>
  );
}
