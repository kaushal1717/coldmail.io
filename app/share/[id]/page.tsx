import { handleGetWithUniqueId } from "@/actions/actions";
import CopyButton from "@/components/buttons/CopyButton";
import SaveButton from "@/components/buttons/SaveButton";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MailboxIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coldmail.io",
  description: "Personalized Cold Emails Made Easy",
  metadataBase: new URL(new URL(process.env.NEXTAUTH_URL!)),
};

const page = async ({ params }: { params: { id: string } }) => {
  const getEmail = await handleGetWithUniqueId(params.id);
  return (
    <div className="m-6">
      <Link className="flex items-center justify-center mb-3" href="/">
        <MailboxIcon className="h-6 w-6" />
        <span className="ml-4 text-md font-medium">Coldmail.io</span>
      </Link>
      <Input readOnly value={getEmail?.subject} />
      <Textarea
        className="h-[500px] resize-none my-4 rounded-lg focus-visible:ring-transparent focus:ring-0 scroll"
        readOnly={true}
        defaultValue={getEmail?.content}
      />
      <div className="flex gap-2 items-center justify-end">
        <CopyButton copyString={getEmail?.content!} />
        <SaveButton
          subject={getEmail?.subject!}
          content={getEmail?.content!}
          category={getEmail?.category!}
        />
      </div>
    </div>
  );
};

export default page;
