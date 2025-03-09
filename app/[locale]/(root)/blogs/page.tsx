import Link from "next/link";

import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";

import { IBlog } from "@/lib/db/models/blog.model";
import { getFilterUrl, toSlug } from "@/lib/utils";

import CollapsibleOnMobile from "@/components/shared/collapsible-on-mobile";
import { getTranslations } from "next-intl/server";
import {
  getAllBlogCategories,
  getAllBlogs,
  getAllBlogTags,
} from "@/lib/actions/blog.actions";
import MostViewedBlogs from "@/components/shared/blog/most-viewed";
import BlogCard from "@/components/shared/blog/blog-card";

const sortOrders = [
  { value: "newest", name: "Newest First" },
  { value: "oldest", name: "Oldest First" },
  { value: "most-viewed", name: "Most Viewed" },
  { value: "most-liked", name: "Most Liked" },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    tag: string;
    sort: string;
    page: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const t = await getTranslations();
  const { q = "all", category = "all", tag = "all" } = searchParams;

  if (q !== "all" || category !== "all" || tag !== "all") {
    return {
      title: `${t("Blog.Search")} ${q !== "all" ? q : ""}
          ${category !== "all" ? ` : ${t("Blog.Category")} ${category}` : ""}
          ${tag !== "all" ? ` : ${t("Blog.Tag")} ${tag}` : ""}`,
    };
  } else {
    return { title: t("Blog.All Blogs") };
  }
}

export default async function BlogSearchPage(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    tag: string;
    sort: string;
    page: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const {
    q = "all",
    category = "all",
    tag = "all",
    sort = "newest",
    page = "1",
  } = searchParams;
  const params = { q, category, tag, sort, page };

  const categories = await getAllBlogCategories();
  const tags = await getAllBlogTags();
  const data = await getAllBlogs({
    category,
    tag,
    query: q,
    page: Number(page),
    sort,
  });

  const t = await getTranslations();

  function extractFirstImageUrl(markdownContent) {
    if (!markdownContent || typeof markdownContent !== "string") {
      return null;
    }
    const regex = /!\[.*?\]\((.*?)\)/;
    const match = markdownContent.match(regex);
    return match ? match[1] : null;
  }

  return (
    <div>
      <div className="my-2 bg-card md:border-b flex-between flex-col md:flex-row">
        <div className="flex items-center">
          {data.totalBlogs === 0
            ? t("Blog.No")
            : `${data.from}-${data.to} ${t("Blog.of")} ${data.totalBlogs}`}{" "}
          {t("Blog.results")}
          {(q !== "all" && q !== "") || category !== "all" || tag !== "all"
            ? ` ${t("Blog.for")} `
            : null}
          {q !== "all" && q !== "" && `"${q}"`}
          {category !== "all" && `   ${t("Blog.Category")}: ${category}`}
          {tag !== "all" && `   ${t("Blog.Tag")}: ${tag}`}
          &nbsp;
          {(q !== "all" && q !== "") || category !== "all" || tag !== "all" ? (
            <Button variant={"link"} asChild>
              <Link href="/blogs">{t("Blog.Clear")}</Link>
            </Button>
          ) : null}
        </div>
        {/* <div>
          <BlogSortSelector
            sortOrders={sortOrders}
            sort={sort}
            params={params}
          />
        </div> */}
      </div>
      <div className="bg-card grid md:grid-cols-5 md:gap-4">
        <CollapsibleOnMobile title={t("Blog.Filters")}>
          <div className="space-y-4">
            <div>
              <div className="font-bold">{t("Blog.Category")}</div>
              <ul>
                <li>
                  <Link
                    className={`${"all" === category && "text-primary"}`}
                    href={getFilterUrl({ category: "all", params })}
                  >
                    {t("Blog.All")}
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && "text-primary"}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold">{t("Blog.Tag")}</div>
              <ul>
                <li>
                  <Link
                    className={`${"all" === tag && "text-primary"}`}
                    href={getFilterUrl({ tag: "all", params })}
                  >
                    {t("Blog.All")}
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && "text-primary"}`}
                      href={getFilterUrl({ tag: t, params })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className="md:col-span-4 space-y-4">
          <div>
            <div className="font-bold text-xl">{t("Blog.Results")}</div>
            <div>{t("Blog.Explore latest blogs and articles")}</div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.blogs.length === 0 && <div>{t("Blog.No blog found")}</div>}
            {data.blogs.map((blog: IBlog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} />
          )}
        </div>
      </div>
      <div className="container mx-auto p-6">
        <MostViewedBlogs />
      </div>
    </div>
  );
}
