import Image from "next/image";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import Link from "next/link";

import { FeaturedPostCardProps } from "@/types/FeaturedPostCardProps";

export default function FeaturedPostCard({
  title,
  date,
  excerpt,
  category,
  author,
  tags,
  image_url,
  slug,
}: FeaturedPostCardProps) {
  const authorUserName = author?.split("|")[0] || "USTH-Coders-Club";
  const authorName = author?.split("|")[1] || "USTH Coders Club";
  return (
    <Link href={`/blog/${slug}`} prefetch={false}>
      <Card className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] flex flex-col justify-end p-4 md:p-6 gap-2 sm:gap-3">
        <div className="relative flex-1 w-full">
          <Image
            className="object-cover rounded-md"
            src={image_url ? image_url : "/ucc_logo_black.png"}
            alt={title || "UCC Logo"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>
        <span className="text-xs sm:text-sm font-base">
          {category} • {date}
        </span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-[family-name:var(--font-space-grotesk)]">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-text font-base line-clamp-2">{excerpt}</p>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 sm:gap-4 items-center">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src={"https://github.com/"+authorUserName+".png"} />
              <AvatarFallback>
                <Image
                  src="/ucc_logo_black.png"
                  alt="USTH Coders Club Logo"
                  width={32}
                  height={32}
                />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm sm:text-base text-text">
              by <span className="font-bold">{authorName}</span>
            </span>
          </div>
          <div className="flex flex-row gap-1 sm:gap-2 items-center">
            {tags?.map((tag, index) => (
              <Badge key={index} variant="neutral" className="text-xs sm:text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}
