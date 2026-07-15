import { getStory } from "@/lib/stories";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StoryView from "./StoryView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) return { title: "Story not found" };

  const timeLeft = Math.max(0, Math.floor((story.expiresAt.seconds * 1000 - Date.now()) / 1000 / 60));
  const expiresLabel = timeLeft > 60
    ? `Expires in ${Math.floor(timeLeft / 60)}h ${timeLeft % 60}m`
    : `Expires in ${timeLeft}m`;

  return {
    title: `TTL Stories — ${story.authorName || "Anonymous"}`,
    description: story.content.slice(0, 160),
    openGraph: {
      title: `TTL Stories — ${story.authorName || "Anonymous"}`,
      description: story.content.slice(0, 160),
      siteName: "TTL Stories",
      type: "article",
      publishedTime: story.createdAt.seconds
        ? new Date(story.createdAt.seconds * 1000).toISOString()
        : undefined,
      images: [{ url: `/story/${id}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `TTL Stories — ${story.authorName || "Anonymous"}`,
      description: story.content.slice(0, 160),
      images: [`/story/${id}/opengraph-image`],
    },
    other: {
      "story:expires": expiresLabel,
      "story:visibility": story.visibility,
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) notFound();

  return <StoryView story={story} />;
}
