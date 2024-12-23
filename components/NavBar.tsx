import { Input } from "./ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

export function NavBar() {
  return (
    <div className="sticky top-0 z-50 h-[84px] border-b-4 border-border dark:border-darkBorder px-12 flex justify-between items-center bg-main">
      <div className="flex items-center gap-2">
        <Image
          src="/ucc_logo_black.png"
          alt="UCC Logo"
          width={60}
          height={60}
          className="rounded-full"
        />
        <span className="text-2xl font-heading font-[family-name:var(--font-space-grotesk)]">
          USTH Coders Club
        </span>
      </div>
      
      <div className="relative w-64">
        <Input 
          placeholder="Search..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      </div>
    </div>
  );
}
