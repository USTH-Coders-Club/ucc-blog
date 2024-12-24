import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";

export default function FeaturedPostCard() {
  return (
    <Card className="w-full h-[450px] flex flex-col justify-end p-4 gap-3">
        <div className="flex-1 bg-gray-200 rounded-md border-border"></div>
        <span className="text-sm font-base">
            Cyber Security • December 18, 2024
        </span>
        <h2 className="text-xl font-heading font-[family-name:var(--font-space-grotesk)]">
            Patch Me If You Can: The Truth About Smartphone Vulnerabilities
        </h2>
        <p className="text-text font-base">
            Discover how smartphone manufacturers conceal security flaws, the risks these vulnerabilities pose to users and businesses, and actionable steps to protect devices from data breaches, identity theft, and exploitative attacks.
        </p>
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            <span className="text-text">
                by <span className="font-bold">John Doe</span>
            </span>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <Eye className="w-6 h-6" />
                <span className="font-base">
                    1000
                </span>
            </div>
        </div>
    </Card>
  );
}
