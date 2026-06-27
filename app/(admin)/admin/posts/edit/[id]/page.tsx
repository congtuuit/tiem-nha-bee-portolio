import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditPostForm } from "./EditPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.posts.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <EditPostForm
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content || "",
        excerpt: post.excerpt || "",
        cover_image: post.cover_image || "",
        status: post.status,
        seo_title: post.seo_title || "",
        seo_description: post.seo_description || "",
        seo_keywords: post.seo_keywords || "",
      }}
    />
  );
}
