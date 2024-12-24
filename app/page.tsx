import { Button } from "@/components/ui/button";
import Image from "next/image";
import FeaturedPostCard from "@/components/FeaturedPostCard";
const categories = [
  "Cybersecurity",
  "AI",
  "Blockchain",
  "Web3",
  "Cloud",
  "DevOps",
  "Software Engineering",
];

export default function Home() {
  return (
    <div className="flex flex-col font-[family-name:var(--font-manrope)] bg-bg">
      {/* Hero Section */}
      <div className="flex flex-col h-[500px] w-full items-center justify-center gap-4">
        <Image src="/ucc_logo_black.png" alt="UCC Logo" width={170} height={170} />
        <div className="flex flex-col items-center">
          <span className="text-2xl font-heading font-[family-name:var(--font-space-grotesk)]">
            USTH Coders Club
          </span>
          <span className="text-6xl font-heading font-[family-name:var(--font-space-grotesk)]">
            Technical Blog
          </span>
        </div>
      </div>

      {/* Blog Section */}
      <div className="grid grid-cols-3 gap-4 h-[1200px] max-w-[1000px] w-full mx-auto">
        <div className="col-span-1 flex flex-col gap-8">
          {/* First column content (1/3) */}
          <Button className="mr-auto text-lg font-semibold font-[family-name:var(--font-space-grotesk)]">All</Button>
          {categories.map((category) => (
            <Button className="mr-auto text-lg font-semibold font-[family-name:var(--font-space-grotesk)]" key={category}>{category}</Button>
          ))}
        </div>
        <div className="col-span-2 flex flex-col gap-8">
          {/* Second column content (2/3) */}
          <FeaturedPostCard />
          <FeaturedPostCard />
          <FeaturedPostCard />
          <FeaturedPostCard />
          <FeaturedPostCard />
        </div>
      </div>
    </div>
  );
}
