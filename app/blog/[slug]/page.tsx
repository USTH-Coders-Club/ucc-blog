import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import {
  fetchBySlug,
  fetchPagesBlocks,
  fetchMorePost,
  notion,
} from "@/lib/notion";
import bookmarkPlugin from "@notion-render/bookmark-plugin";
import { NotionRenderer } from "@notion-render/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import hljsPlugin from "@notion-render/hljs-plugin";
import { Metadata } from "next";

type MoreCardProps = {
  image_url?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  slug?: string;
};
function MoreCard({ image_url, title, date, excerpt, slug }: MoreCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="flex gap-2 md:gap-4 p-2 md:p-4">
        <Image
          className="w-16 h-16 md:w-20 md:h-20"
          src={image_url || "/ucc_logo_black.png"}
          alt="UCC Logo"
          width={80}
          height={80}
        />
        <div className="max-w-md overflow-hidden">
          <h3 className="font-semibold text-sm md:text-base truncate">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 truncate">{date}</p>
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 overflow-hidden text-ellipsis">
            {excerpt}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchBySlug(slug);

  if (!page) {
    return {
      title: "Post Not Found",
    };
  }

  const title = (
    page.properties.Title as { title: Array<{ plain_text: string }> }
  ).title[0]?.plain_text;
  const excerpt = (
    page.properties.Excerpt as { rich_text: Array<{ plain_text: string }> }
  ).rich_text
    .map((text: { plain_text: string }) => text.plain_text)
    .join("");

  return {
    title: title,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      type: "article",
      publishedTime: (page.properties.Date as { created_time: string })
        .created_time,
      authors: [
        (page.properties.Author as { rich_text: Array<{ plain_text: string }> })
          .rich_text[0]?.plain_text,
      ],
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        Invalid page slug
      </div>
    );
  }

  const page = await fetchBySlug(slug);
  const morepost = await fetchMorePost();

  if (!page) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        Page not found
      </div>
    );
  }

  const title = (
    page.properties.Title as { title: Array<{ plain_text: string }> }
  ).title[0]?.plain_text;
  const publishedTime = new Date(
    (page.properties.Date as { created_time: string }).created_time
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const author = (
    page.properties.Author as { rich_text: Array<{ plain_text: string }> }
  ).rich_text[0]?.plain_text;

  type MorePost = PageObjectResponse & {
    properties: {
      Title: { title: Array<{ plain_text: string }> };
      Date: { created_time: string };
      Excerpt: { rich_text: Array<{ plain_text: string }> };
      Categories: { multi_select: Array<{ name: string }> };
      slug: { rich_text: Array<{ plain_text: string }> };
    };
    cover?: {
      external?: { url: string };
      file?: { url: string };
    };
  };
  const morepostlist = (morepost.results as MorePost[]).map((item) => ({
    title: item.properties.Title.title[0]?.plain_text || "Untitled",
    date: new Date(item.properties.Date.created_time).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ),
    excerpt: item.properties.Excerpt.rich_text
      .map((text: { plain_text: string }) => text.plain_text)
      .join("") || "No excerpt available",
    category: item.properties.Categories.multi_select[0]?.name || "Uncategorized",
    image_url: item.cover?.external?.url || item.cover?.file?.url || "/ucc_logo_black.png",
    slug: item.properties.slug.rich_text[0]?.plain_text || "",
  }));

  const blocks = await fetchPagesBlocks(page.id);
  const renderer = new NotionRenderer({
    client: notion,
  });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  const authorUserName = author?.split("|")[0] || "USTH-Coders-Club";
  const authorName = author?.split("|")[1] || "USTH Coders Club";
  const authorDescription = author?.split("|")[2] || "RnD";

  return (
    <>
      <div className="flex flex-col lg:flex-row font-[family-name:var(--font-manrope)] p-4 md:p-8 lg:p-24 gap-8 lg:gap-20 h-full ">
        <Card className="w-full lg:w-3/4 bg-bg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl lg:text-[36px] font-bold">
              {title}
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-500">
              {publishedTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="notion-render [&>*]:mt-4 first:[&>*]:mt-0"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
          </CardContent>
        </Card>
        <div className="w-full lg:w-1/4 flex flex-col gap-8 lg:gap-16 lg:sticky lg:top-24 lg:h-fit">
          <Card className="flex gap-4 items-center p-2 md:p-4">
            <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-black">
              <AvatarImage
                src={"https://github.com/" + authorUserName + ".png"}
              />
              <AvatarFallback>
                <Image
                  src="/ucc_logo_black.png"
                  alt="USTH Coders Club Logo"
                  width={32}
                  height={32}
                />
              </AvatarFallback>
            </Avatar>
            <div className="relative p-2 bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] before:absolute before:left-[-10px] before:top-4 before:w-0 before:h-0 before:border-t-[8px] before:border-r-[10px] before:border-b-[8px] before:border-t-transparent before:border-r-black before:border-b-transparent before:border-l-transparent">
              <p className="font-bold text-base md:text-lg">
                I&apos;m {authorName}
              </p>
              <p className="text-sm md:text-base">{authorDescription}</p>
            </div>
          </Card>
          <div className="flex flex-col gap-3 md:gap-4">
            <p className="font-bold text-lg md:text-xl">More posts</p>
            {morepostlist.map((item, index) => (
              <MoreCard
                key={index}
                image_url={item.image_url}
                title={item.title}
                date={item.date}
                excerpt={item.excerpt}
                slug={item.slug}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
