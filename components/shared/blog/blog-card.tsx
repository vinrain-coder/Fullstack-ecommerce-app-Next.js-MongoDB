"use client";

import Image from "next/image";
import Link from "next/link";

export default function BlogCard({
  blog,
}: {
  blog: {
    _id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string | Date;
  };
}) {
  const formatDateTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  function extractFirstImageUrl(markdownContent) {
    if (!markdownContent || typeof markdownContent !== "string") {
      return null;
    }
    const regex = /!\[.*?\]\((.*?)\)/;
    const match = markdownContent.match(regex);
    return match ? match[1] : null;
  }

  const firstImageUrl = extractFirstImageUrl(blog.content);
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition duration-300">
      <Link href={`/blogs/${blog.slug}`}>
        <div className="relative w-full h-56">
          <Image
            src={firstImageUrl || "/images/not-found.png"}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/blogs/${blog.slug}`}>
          <h3 className="text-xl font-semibold hover:text-primary">
            {blog.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1">
          {blog.content.slice(0, 100)}...
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-500">
            {formatDateTime(blog.createdAt)}
          </div>
          <div className="flex items-center gap-3"></div>
        </div>

        <div className="mt-3 flex gap-2 text-xs">
          <span className="bg-blue-100 text-secondary px-2 py-1 rounded">
            {blog.category}
          </span>
          {blog.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
