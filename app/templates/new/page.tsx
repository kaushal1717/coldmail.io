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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { json } from "stream/consumers";

// Zod schema definition for form validation
const emailFormSchema = z.object({
  emailPurpose: z.enum([
    "follow-up",
    "job-application",
    "to-ceo",
    "referrals",
    "product-promotion",
  ]),
  subject: z.string().min(1, "Subject is required"),
  messageTone: z.enum([
    "formal",
    "informal",
    "enthusiastic",
    "concise",
    "friendly",
  ]),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, "Platform is required"),
        link: z.string().url("Invalid URL"),
      })
    )
    .max(4, "You can add up to 4 social links"),
});

type emailFormType = z.infer<typeof emailFormSchema>;

const Page: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const methods = useForm<emailFormType>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      socialLinks: [{ platform: "", link: "" }],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: methods.control,
    name: "socialLinks",
  });

  const onSubmit: SubmitHandler<emailFormType> = async (data) => {
    console.log("Form submitted:", data);
    try {
      const response = await fetch("/api/gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network error occurred: ");
      }
      const result: any = await response.json();
      const content = result?.generator?.choices?.[0]?.message?.content;
      console.log(content);

      if (content) {
        setResponseMessage(content);
      } else {
        setResponseMessage(
          "Either API key is expired or any internal error occurred"
        );
      }
    } catch (error) {
      console.log("Error generated while fetching response: ", error);
      setResponseMessage("Failed to generate email");
    }
  };

  return (
    <>
      <h2 className="flex justify-center items-center text-3xl font-bold tracking-wide">
        Create new template
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <Card className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {/* Email Purpose Field */}
              <FormField
                control={methods.control}
                name="emailPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Purpose</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select email purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="follow-up">Follow Up</SelectItem>
                        <SelectItem value="job-application">
                          Job Application
                        </SelectItem>
                        <SelectItem value="to-ceo">To CEO</SelectItem>
                        <SelectItem value="referrals">Referral</SelectItem>
                        <SelectItem value="product-promotion">
                          Product Promotion
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject Field */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  placeholder="Enter subject"
                  {...methods.register("subject")}
                />
                {methods.formState.errors.subject && (
                  <span className="text-red-500">
                    {methods.formState.errors.subject.message}
                  </span>
                )}
              </div>

              {/* Message Tone Field */}
              <div className="space-y-2">
                <FormLabel>Message Tone</FormLabel>
                <RadioGroup
                  onValueChange={methods.setValue.bind(null, "messageTone")}
                >
                  <div className="space-y-1">
                    <RadioGroupItem value="formal" />
                    <Label>Formal</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="informal" />
                    <Label>Informal</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="enthusiastic" />
                    <Label>Enthusiastic</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="concise" />
                    <Label>Concise</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="friendly" />
                    <Label>Friendly</Label>
                  </div>
                </RadioGroup>
                {methods.formState.errors.messageTone && (
                  <span className="text-red-500">
                    {methods.formState.errors.messageTone.message}
                  </span>
                )}
              </div>

              {/* Social Links Section */}
              <div className="space-y-2">
                <Label>Social Links</Label>
                <div className="grid gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_1fr_auto] gap-2"
                    >
                      <input
                        placeholder="Platform"
                        {...methods.register(`socialLinks.${index}.platform`)}
                        className="border border-secondary rounded"
                      />
                      <input
                        placeholder="Link"
                        {...methods.register(`socialLinks.${index}.link`)}
                        className="border border-secondary rounded"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="border border-gray-300 rounded p-1"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                      {methods.formState.errors.socialLinks?.[index]
                        ?.platform && (
                        <span className="text-red-500">
                          {
                            methods.formState.errors.socialLinks?.[index]
                              ?.platform.message
                          }
                        </span>
                      )}
                      {methods.formState.errors.socialLinks?.[index]?.link && (
                        <span className="text-red-500">
                          {
                            methods.formState.errors.socialLinks?.[index]?.link
                              .message
                          }
                        </span>
                      )}
                    </div>
                  ))}
                  {fields.length < 4 && (
                    <Button
                      type="button"
                      onClick={() => append({ platform: "", link: "" })}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Generate</Button>
              </div>
            </form>
          </FormProvider>
        </Card>
        <div className="flex flex-col gap-6">
          <Textarea
            className="h-[500px] resize-none"
            placeholder="Your generated email will appear here..."
            value={responseMessage}
            readOnly
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
    </>
  );
};

export default Page;
