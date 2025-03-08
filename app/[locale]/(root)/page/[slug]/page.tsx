import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { getWebPageBySlug } from "@/lib/actions/web-page.actions";
import remarkGfm from "remark-gfm";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;

  const webPage = await getWebPageBySlug(slug);
  if (!webPage) {
    return { title: "Web page not found" };
  }
  return {
    title: webPage.title,
  };
}

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; color: string; size: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const webPage = await getWebPageBySlug(slug);

  if (!webPage) notFound();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="h1-bold py-4">{webPage.title}</h1>
      <section className="text-justify text-lg mb-20 web-page-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 p-2 bg-gray-100 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 p-2">{children}</td>
            ),
          }}
        >
          {webPage.content}
        </ReactMarkdown>
      </section>
    </div>
  );
}
