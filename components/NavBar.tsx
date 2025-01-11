"use client";

import { Input } from "./ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Post {
  title?: string;
  image_url?: string;
  slug?: string;
}

interface NotionSearchResult {
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    slug: { rich_text: Array<{ plain_text: string }> };
  };
  cover?: {
    external?: { url: string };
    file?: { url: string };
  };
}

export function NavBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchPages = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api?action=search&q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        console.log(data);
        setSearchResults(data.map((item: NotionSearchResult) => ({
          title: item.properties.Title.title[0].plain_text,
          image_url: item.cover?.external?.url || item.cover?.file?.url || "",
          slug: item.properties.slug.rich_text[0]?.plain_text || "",
        })));
      } catch (error) {
        console.error('Search failed:', error);
      }
      setIsLoading(false);
    };

    const debounce = setTimeout(searchPages, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <div className="sticky top-0 z-50 h-[84px] border-b-4 border-border dark:border-darkBorder px-4 md:px-8 lg:px-12 flex justify-between items-center bg-main">
      <Link href="/" className="flex items-center gap-1 md:gap-2">
        <Image
          src="/ucc_logo_black.png"
          alt="UCC Logo"
          width={60}
          height={60}
          className="w-12 h-12 md:w-[60px] md:h-[60px] rounded-full"
        />
        <span className="text-lg md:text-2xl font-heading font-[family-name:var(--font-space-grotesk)]">
          USTH Coders Club
        </span>
      </Link>

      <div className="relative w-32 sm:w-48 md:w-64">
        <Input 
          placeholder="Search..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[400px] overflow-y-auto">
            {searchResults.map((result: Post, index) => (
              <Link
                prefetch={false}
                key={index}
                href={`/blog/${result.slug}`}
                className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex gap-2">
                  <Image
                    src={result.image_url || "/ucc_logo_black.png"}
                    alt="UCC Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <span>{result.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 text-center">
            Searching...
          </div>
        )}
      </div>
    </div>
  );
}
