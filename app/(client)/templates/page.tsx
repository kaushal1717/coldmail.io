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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CopyIcon, EyeIcon, Pencil, Share, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { handleDelete, handleGet } from "@/actions/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import LoadingSkeleton from "@/components/common/loading-skeleton";

export default function Component() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
  const router = useRouter();

  const fetchTemplates = async () => {
    setLoading(true);
    const emailTemplates = await handleGet();
    if (emailTemplates!.length > 0 && emailTemplates![0]?.emails?.length > 0) {
      setTemplates(emailTemplates![0]!);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredTemplates =
    selectedCategory === "All"
      ? templates?.emails || []
      : templates?.emails?.filter(
          (template: any) => template.category === selectedCategory
        ) || [];

  const indexOfLastTemplate = currentPage * itemsPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - itemsPerPage;
  let currentTemplates = filteredTemplates.slice(
    indexOfFirstTemplate,
    indexOfLastTemplate
  );
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  console.log("templates", templates);
  const deleteTemplate = async (emailId: string) => {
    const deleted = await handleDelete(emailId);
    if (deleted) {
      toast({
        title: "Template Successfully deleted",
        description: "Your template has been deleted",
      });
      setTemplates((prev: any) => {
        let filtered = prev.emails.filter(
          (email: any) => email.id !== deleted.id
        );
        return { ...prev, emails: filtered };
      });
    }
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "share this link to others to share the template",
    });
  };
  return (
    <>
      <div className="m-3 max-w-6xl sm:mx-auto mt-6 px-4 py-8 sm:px-6 lg:px-8 border-gray-700 border-2 rounded-md bg-gray-800 bg-opacity-50 shadow-gray-700 shadow-md">
        <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("follow-up")}
                >
                  Follow-up
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("job-application")}
                >
                  Recruiter (Job Application)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("to-ceo")}
                >
                  CEO/Founder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("product-promotion")}
                >
                  Product Advertisement
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCategoryChange("referrals")}
                >
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
        </div>
        {loading && <LoadingSkeleton />}
        {!loading && currentTemplates.length == 0 && (
          <div className="text-center text-2xl p-12 ">No Templates</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentTemplates?.map((template: any) => (
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
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost">
                        <EyeIcon className="w-5 h-5 text-slate-300" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{template.subject}</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        className="h-[450px] resize-none my-4 rounded-lg outline-none focus-visible:ring-transparent  border-none focus:ring-0 scroll "
                        readOnly={true}
                        defaultValue={template.content}
                      />

                      <Button
                        className="gap-2 font-semibold"
                        onClick={() =>
                          router.push(`/templates/edit/${template.id}`)
                        }
                      >
                        Edit
                        <Pencil size={16} />
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <span className="text-slate-400">|</span>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="ghost">
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your email template.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTemplate(template.id)}
                        >
                          Yes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <span className="text-slate-400">|</span>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost">
                        <Share className="w-5 h-5 text-slate-300" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share</DialogTitle>
                      </DialogHeader>
                      <Input
                        readOnly
                        value={`${window.location.origin}/share/${template.uniqueIdentifier}`}
                      />
                      <Button
                        className="gap-2"
                        onClick={() =>
                          copyShareLink(
                            `${window.location.origin}/share/${template.uniqueIdentifier}`
                          )
                        }
                      >
                        <CopyIcon className="w-5 h-5" />
                        Copy
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 mb-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage > 1 ? (
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              ) : (
                <PaginationPrevious className="text-gray-500 cursor-not-allowed" />
              )}
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "bg-[#1E293B]" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              {currentPage < totalPages ? (
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              ) : (
                <PaginationNext className="text-gray-500 cursor-not-allowed" />
              )}
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
