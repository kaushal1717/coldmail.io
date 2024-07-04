"use client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { JSX, SVGProps } from "react";
import { Minus, Plus } from "lucide-react";
import MessageTonesSection from "@/components/component/email-create/MessageTones";
import page from "@/app/pricing/page";
import { FormProvider, useForm } from "react-hook-form";
import { emailFormSchema, emailFormType } from "@/app/shared/EmailFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const Page: React.FC = () => {
  const methods = useForm<emailFormType>({
    resolver: zodResolver(emailFormSchema),
  });
  const tone = ["Shorter", "Longer", "Simpler", "Casual", "Professional"];
  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Email</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="job-application">Job Application</SelectItem>
                <SelectItem value="to-ceo">To CEO/Founder</SelectItem>
                <SelectItem value="referrals">Referrals</SelectItem>
                <SelectItem value="product-promotion">
                  Product Promotion
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter subject" />
          </div>
          <div className="space-y-2">
            <MessageTonesSection />
          </div>
          {/* social Links */}
          <div className="space-y-2">
            <Label>Social Links</Label>
            <div className="grid gap-4">
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input placeholder="Platform" />
                <Input placeholder="Link" />
                <Button variant="outline" size="icon">
                  <Plus />
                </Button>
              </div>
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input placeholder="Platform" />
                <Input placeholder="Link" />
                <Button variant="outline" size="icon">
                  <Minus />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Generate</Button>
          </div>
        </Card>
        <div className="flex flex-col gap-6">
          <Textarea
            className="h-[500px] resize-none"
            placeholder="Your generated email will appear here..."
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline">Copy</Button>
              <Button variant="outline">Save</Button>
            </div>
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Page;
