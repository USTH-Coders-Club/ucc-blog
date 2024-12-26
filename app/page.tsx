"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FeaturedPostCard from "@/components/FeaturedPostCard";
import { useState, useEffect } from "react";

const categoryWithColors = {
  "Cyber Security": "#FF4B4B",
  AI: "#4B83FF",
  Blockchain: "#FFB74B",
  Web3: "#4BFFA7",
  Cloud: "#A74BFF",
  DevOps: "#FF4B9D",
  "Software Engineering": "#4BFFED",
};

type Post = {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  author: string;
  tags: string[];
  image_url: string;
  slug?: string;
};

interface NotionPage {
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    Date: { created_time: string };
    Excerpt: { rich_text: Array<{ plain_text: string }> };
    Categories: { multi_select: Array<{ name: string }> };
    Author: { rich_text: Array<{ plain_text: string }> };
    Tags: { multi_select: Array<{ name: string }> };
    slug: { rich_text: Array<{ plain_text: string }> };
  };
  cover?: {
    external?: { url: string };
    file?: { url: string };
  };
}

export default function Home() {
  const [category, setCategory] = useState("All");
  const [posts, setPosts] = useState([] as Post[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api?action=list")
      .then((res) => res.json())
      .then((data) => {
        const transformedPosts: Post[] = data.results.map(
          (item: NotionPage) => ({
            title: item.properties.Title.title[0].plain_text,
            date: new Date(
              item.properties.Date.created_time
            ).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            excerpt: item.properties.Excerpt.rich_text
              .map((text: { plain_text: string }) => text.plain_text)
              .join(""),
            category: item.properties.Categories.multi_select[0]?.name || "",
            author: item.properties.Author.rich_text[0]?.plain_text || "",
            tags: item.properties.Tags.multi_select.map(
              (tag: { name: string }) => tag.name
            ),
            image_url: item.cover?.external?.url || item.cover?.file?.url || "",
            slug: item.properties.slug.rich_text[0]?.plain_text || "",
          })
        );

        const filteredPosts =
          category === "All"
            ? transformedPosts
            : transformedPosts.filter((post) => post.category === category);

        setPosts(filteredPosts);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="flex flex-col font-[family-name:var(--font-manrope)]">
      {/* Hero Section */}
      <div className="flex flex-col h-[300px] md:h-[400px] lg:h-[500px] w-full items-center justify-center gap-4 px-4">
        <Image
          src="/ucc_logo_black.png"
          alt="UCC Logo"
          width={120}
          height={120}
          className="md:w-[150px] md:h-[150px] lg:w-[170px] lg:h-[170px]"
        />
        <div className="flex flex-col items-center text-center">
          <span className="text-xl md:text-2xl font-heading font-[family-name:var(--font-space-grotesk)]">
            USTH Coders Club
          </span>
          <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-[family-name:var(--font-space-grotesk)]">
            Technical Blog
          </span>
        </div>
      </div>

      {/* Blog Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1000px] w-full mx-auto px-4 pb-8">
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 lg:gap-8 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          <Button
            onClick={() => setCategory("All")}
            className="text-sm lg:text-lg font-semibold whitespace-nowrap font-[family-name:var(--font-space-grotesk)]"
          >
            All
          </Button>

          {Object.keys(categoryWithColors).map((category) => (
            <Button
              onClick={() => setCategory(category)}
              className="text-sm lg:text-lg font-semibold whitespace-nowrap font-[family-name:var(--font-space-grotesk)]"
              key={category}
              style={{
                backgroundColor:
                  categoryWithColors[
                    category as keyof typeof categoryWithColors
                  ],
              }}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
          {loading && (
            <div className="flex flex-col gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 md:h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}
          {!loading &&
            posts.map((post, index) => (
              <FeaturedPostCard
                key={index}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                category={post.category}
                author={post.author}
                tags={post.tags}
                image_url={post.image_url}
                slug={post.slug}
              />
            ))}
          {!loading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-2xl font-bold">No posts found</span>
              <span className="text-lg">Please try again later</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
