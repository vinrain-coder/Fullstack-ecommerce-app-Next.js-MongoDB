import Link from "next/link";

import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import { getAllBlogs } from "@/lib/actions/blog.actions";
import { deleteBlog } from "../../../../lib/actions/blog.actions";
import { IBlog } from "@/lib/db/models/blog.model";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Admin Blog Pages",
};

export default async function BlogAdminPage() {
  const session = await auth();
  if (session?.user.role !== "Admin")
    throw new Error("Admin permission required");

  const { blogs } = await getAllBlogs({});

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h1-bold">Blogs</h1>
        <Button asChild variant="default">
          <Link href="/admin/blogs/create">Create Blog</Link>
        </Button>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>IsPublished</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(blogs) && blogs.length > 0 ? (
              blogs.map((blog: IBlog) => (
                <TableRow key={blog._id}>
                  <TableCell>{formatId(blog._id)}</TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.slug}</TableCell>
                  <TableCell>
                    {typeof blog.category === "string"
                      ? blog.category
                      : "Unknown"}
                  </TableCell>
                  <TableCell>{blog.views}</TableCell>
                  <TableCell>{blog.isPublished ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blogs/${blog._id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog id={blog._id} action={deleteBlog} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No blogs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
