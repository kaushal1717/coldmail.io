"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { handleGet } from "@/actions/actions";

export default function Component() {
  const [templates, setTemplates] = useState<any>([]);
  const [emails, setEmails] = useState<any>([]);

  const fetchTemplates = async () => {
    const emailTemplates = await handleGet();
    setTemplates(emailTemplates![0]);
    setEmails(emailTemplates);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  console.log(templates);

  return (
    <>
      <div className="w-full max-w-6xl mx-auto mt-6 px-4 py-8 sm:px-6 lg:px-8 border-gray-700 border-2 rounded-md bg-gray-800 bg-opacity-50 shadow-gray-700 shadow-md">
        <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>Template Categories</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Follow-up</DropdownMenuItem>
                <DropdownMenuItem>Recruiter (Job Application)</DropdownMenuItem>
                <DropdownMenuItem>CEO/Founder</DropdownMenuItem>
                <DropdownMenuItem>Product Advertisement</DropdownMenuItem>
                <DropdownMenuItem>Referral</DropdownMenuItem>
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates?.emails?.map((template: any) => {
            return (
              <div
                key={template.id}
                className="bg-background rounded-lg shadow-lg overflow-hidden border-gray-800 border-2"
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-left">
                    {template.subject}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-5 text-left">
                    {template.content}
                  </p>
                  <div className="flex items-center justify-end mt-4">
                    <Button variant="ghost">
                      <EyeIcon className="w-5 h-5 text-slate-300" />
                    </Button>
                    <span className="text-slate-400">|</span>
                    <Button variant="ghost">
                      <TrashIcon className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-10 mb-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
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
