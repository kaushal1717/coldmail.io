import { Suspense } from "react";
import { getTemplatesPaginated } from "@/actions/actions";
import TemplatesClient from "./_components/TemplatesClient";
import TemplatesHeader from "./_components/TemplatesHeader";
import TemplatesPagination from "./_components/TemplatesPagination";
import LoadingSkeleton from "@/components/common/loading-skeleton";

interface TemplatesPageProps {
  searchParams: {
    page?: string;
    category?: string;
  };
}

export default async function TemplatesPage({
  searchParams,
}: TemplatesPageProps) {
  const page = parseInt(searchParams.page || "1");
  const category = searchParams.category || "All";

  const { templates, totalPages, currentPage } = await getTemplatesPaginated(
    page,
    8,
    category
  );

  return (
    <div className="border-gray-700 px-6 py-12 m-6 border-2 rounded-md bg-gray-800 bg-opacity-50 shadow-gray-700 shadow-md">
      <div className="w-full">
        <TemplatesHeader selectedCategory={category} />

        <Suspense fallback={<LoadingSkeleton />}>
          {templates.length === 0 ? (
            <div className="text-center text-2xl p-12">No Templates</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <TemplatesClient key={template.id} template={template} />
              ))}
            </div>
          )}
        </Suspense>

        <TemplatesPagination
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
