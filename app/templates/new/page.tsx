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
import { Plus, PlusCircle, SendIcon, Trash2, X } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Zod schema definition for form validation
const emailFormSchema = z.object({
  senderName: z.string().min(1, "This field is required"),
  emailPurpose: z.enum([
    "follow-up",
    "job-application",
    "to-ceo",
    "referrals",
    "product-promotion",
  ]),
  subject: z.string().min(1, "This field is required"),
  emailTone: z.enum([
    "formal",
    "informal",
    "enthusiastic",
    "concise",
    "friendly",
  ]),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, "This field is required"),
        link: z.string().url("Invalid URL"),
      })
    )
    .max(4, "You can add up to 4 social links"),
  skills: z.string().min(1, "Skills/USP is required"),
});

export type emailFormType = z.infer<typeof emailFormSchema>;

const Page: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [email, setEmail] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const { toast } = useToast();
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
        setSubject(data.subject);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(responseMessage);
    toast({
      title: "Mail copied!!",
      description: "Your email has been copied to clipboard",
    });
  };

  const handleSave = () => {};

  const addRecipient = () => {
    if (email.length == 0) {
      toast({
        title: "Email field is empty",
        description: "Please enter recipient email",
      });
      return;
    }
    if (recipientEmail.find((mail) => mail === email)) {
      toast({
        title: "Enter a new email",
        description: "Email already exists in the list!",
      });
      return;
    }
    setRecipientEmail((prev: string[]) => [...prev, email]);
    setEmail("");
  };

  const removeRecipient = (mail: string) => {
    setRecipientEmail(recipientEmail.filter((email) => email !== mail));
  };

  const openClientWithEmail = () => {
    console.log(responseMessage);
    window.location.href = `mailto:${recipientEmail.join(
      ","
    )}?subject=${subject}&body=${encodeURIComponent(responseMessage)}`;
  };

  return (
    <>
      <h2 className="flex justify-center items-center text-3xl font-bold tracking-wide">
        Create new template
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <Card className="p-6 space-y-6 my-4">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {/* sender name */}
              <div className="space-y-2 my-4">
                <Label className="text-lg" htmlFor="subject">
                  Individual / Organization Name
                </Label>
                <Input
                  placeholder="Enter your name"
                  {...methods.register("senderName")}
                />
                {methods.formState.errors.senderName && (
                  <span className="text-red-500">
                    {methods.formState.errors.senderName.message}
                  </span>
                )}
              </div>
              {/* Email Purpose Field */}
              <div className="my-4">
                <FormField
                  control={methods.control}
                  name="emailPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Email Purpose</FormLabel>
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
              </div>

              {/* Subject Field */}
              <div className="space-y-2 my-4">
                <Label className="text-lg" htmlFor="subject">
                  Subject
                </Label>
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

              {/* usp/skills */}
              <div className="space-y-2 my-4">
                <Label className="text-lg" htmlFor="subject">
                  Individual Skills / Product Features
                </Label>
                <Input
                  placeholder="Enter skills/USP"
                  {...methods.register("skills")}
                />
                {methods.formState.errors.skills && (
                  <span className="text-red-500">
                    {methods.formState.errors.skills.message}
                  </span>
                )}
              </div>

              {/* Email Tone Field */}
              <div className="space-y-2 my-4">
                <FormLabel className="text-lg">Email Tone</FormLabel>
                <RadioGroup
                  onValueChange={methods.setValue.bind(null, "emailTone")}
                  className="mx-4"
                >
                  <div className="space-y-1">
                    <RadioGroupItem value="formal" />
                    <Label className="ml-2">Formal</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="informal" />
                    <Label className="ml-2">Informal</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="enthusiastic" />
                    <Label className="ml-2">Enthusiastic</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="concise" />
                    <Label className="ml-2">Concise</Label>
                  </div>
                  <div className="space-y-1">
                    <RadioGroupItem value="friendly" />
                    <Label className="ml-2">Friendly</Label>
                  </div>
                </RadioGroup>
                {methods.formState.errors.emailTone && (
                  <span className="text-red-500">
                    {methods.formState.errors.emailTone.message}
                  </span>
                )}
              </div>

              {/* Social Links Section */}
              <div className="space-y-2 my-4">
                <Label className="text-lg">Social Links</Label>
                <div className="grid gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_1fr_auto_auto] gap-2"
                    >
                      <Input
                        placeholder="Platform"
                        {...methods.register(`socialLinks.${index}.platform`)}
                      />
                      <Input
                        placeholder="Link"
                        {...methods.register(`socialLinks.${index}.link`)}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
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
                      variant="outline"
                      type="button"
                      onClick={() => append({ platform: "", link: "" })}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="text-md bg-gray-300">
                  Generate
                </Button>
              </div>
            </form>
          </FormProvider>
        </Card>
        <div className="flex flex-col gap-4">
          <Textarea
            className="h-[750px] resize-none my-4 rounded-lg"
            placeholder="Your generated email will appear here..."
            value={responseMessage}
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy}>
                Copy
              </Button>
              <Button variant="outline">Save</Button>
            </div>
            <Dialog>
              <DialogTrigger className="flex flex-row bg-white text-black px-3 py-2  font-sans font-semibold rounded-lg">
                Send <SendIcon />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emails</DialogTitle>
                  <DialogDescription>
                    <div className="flex mt-2 items-center gap-2">
                      <Input
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <PlusCircle
                        size={30}
                        color="white"
                        className="cursor-pointer"
                        onClick={addRecipient}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {recipientEmail.length > 0 &&
                        recipientEmail.map((email: string) => {
                          return (
                            <div key={email}>
                              <div className="bg-slate-300 px-2 py-1 text-sm flex items-center justify-between gap-2 text-black rounded-lg">
                                {email}
                                <X
                                  size={16}
                                  onClick={() => removeRecipient(email)}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {recipientEmail.length > 0 && (
                      <div className="mt-3 w-full">
                        <Button onClick={openClientWithEmail}>send</Button>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
