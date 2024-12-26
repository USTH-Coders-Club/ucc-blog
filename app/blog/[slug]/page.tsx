import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
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
    <Link href={`/blog/${slug}`} scroll={false} prefetch>
      <Card className="flex gap-2 md:gap-4 p-2 md:p-4">
        <Image
          className="w-16 h-16 md:w-20 md:h-20"
          src={image_url || "/ucc_logo_black.png"}
          alt="UCC Logo"
          width={80}
          height={80}
        />
        <div className="max-w-md">
          <h3 className="font-semibold text-sm md:text-base">{title}</h3>
          <p className="text-xs md:text-sm text-gray-500">{date}</p>
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
            {excerpt}
          </p>
        </div>
      </Card>
    </Link>
  );
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
    title: item.properties.Title.title[0].plain_text,
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
      .join(""),
    category: item.properties.Categories.multi_select[0]?.name || "",
    image_url: item.cover?.external?.url || item.cover?.file?.url || "",
    slug: item.properties.slug.rich_text[0]?.plain_text || "",
  }));

  const blocks = await fetchPagesBlocks(page.id);
  const renderer = new NotionRenderer({
    client: notion,
  });

  renderer.use(hljsPlugin({}));
  renderer.use(bookmarkPlugin(undefined));

  const html = await renderer.render(...blocks);

  

  return (
    <>
      <div className="flex flex-col lg:flex-row font-[family-name:var(--font-manrope)] p-4 md:p-8 lg:p-24 gap-8 lg:gap-20 h-full ">
        <Card className="w-full lg:w-3/4 p-4 md:p-6 lg:p-8">
          <CardTitle className="text-2xl md:text-3xl lg:text-[36px] font-bold">
            {title}
          </CardTitle>
          <p className="text-xs md:text-sm text-gray-500">{publishedTime}</p>
          <div
            className="notion-render [&>*]:mt-4 first:[&>*]:mt-0"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </Card>
        <div className="w-full lg:w-1/4 flex flex-col gap-8 lg:gap-16">
          <div className="flex gap-4 items-center">
            <Avatar className="w-12 h-12 md:w-16 md:h-16">
              <AvatarImage src="./ucc_logo_black.png" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-base md:text-lg">{author}</p>
              <p className="text-sm md:text-base">
                Cyber Security Analyst, RnD Team
              </p>
            </div>
          </div>
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
