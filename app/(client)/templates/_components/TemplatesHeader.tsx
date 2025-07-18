"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface TemplatesHeaderProps {
  selectedCategory: string;
}

export default function TemplatesHeader({
  selectedCategory,
}: TemplatesHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    // Reset to page 1 when category changes
    params.set("page", "1");

    router.push(`/templates?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    updateSearchParams(category);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span>{selectedCategory}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          <DropdownMenuLabel>Select Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleCategoryChange("All")}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCategoryChange("follow-up")}>
            Follow-up
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleCategoryChange("job-application")}
          >
            Recruiter (Job Application)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCategoryChange("to-ceo")}>
            CEO/Founder
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleCategoryChange("product-promotion")}
          >
            Product Advertisement
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCategoryChange("referrals")}>
            Referral
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        href="/templates/new"
        className="bg-primary text-primary-foreground rounded-full p-3 shadow-md hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
        prefetch={false}
      >
        <PlusIcon className="w-6 h-6" />
        <span className="sr-only">Create new email template</span>
      </Link>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
