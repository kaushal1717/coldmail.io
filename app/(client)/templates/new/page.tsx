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
import React, { Suspense, useState } from "react";
import { Plus, PlusCircle, Trash2, X, Loader2 } from "lucide-react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleSave } from "@/actions/actions";
import clsx from "clsx";
import { models } from "@/lib/constants";
import { emailFormSchema, emailFormType } from "@/schemas";
import { WorkspaceSelector } from "@/components/workspace/WorkspaceSelector";

// Inner component that uses useSearchParams
const TemplateForm: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [selectedWorkspace, setSelectedWorkspace] = useState<
    string | undefined
  >();

  const searchParams = useSearchParams();
  const workspaceFromUrl = searchParams.get("workspace");

  const handleValueChange = (value: any) => {
    setSelectedValue(value);
    methods.setValue("emailTone", value);
  };

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
    try {
      setIsLoading(true);
      setResponseMessage("");
      const response = await fetch("/api/gen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, model: selectedModel }),
      });
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Network error occurred: ");
      }

      if (!response.body) {
        setIsLoading(false);
        setResponseMessage("No response body");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          fullText += chunk;
          setResponseMessage(fullText);
        }
      }
      setIsLoading(false);
      setSubject(data.subject);
      setCategory(data.emailPurpose);
    } catch (error) {
      console.log("Error generated while fetching response: ", error);
      setIsLoading(false);
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

  const onSave = async () => {
    setIsSaving(true);
    try {
      const emailData: any = await handleSave(
        responseMessage,
        subject,
        category,
        selectedWorkspace
      );
      if (emailData) {
        toast({
          title: "Saved successfully!!",
          description: selectedWorkspace
            ? "Your email template has been saved to the workspace!"
            : "Your personal email template has been saved!",
        });
      }
    } catch (error) {
      toast({
        title: "Error saving",
        description:
          error instanceof Error ? error.message : "Failed to save email",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl flex justify-center items-center sm:text-3xl font-bold sm:tracking-wide">
        Create new template
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <Card className="p-6 space-y-6 my-4">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {/* Workspace Selector - NEW */}
              <WorkspaceSelector
                value={selectedWorkspace}
                onValueChange={setSelectedWorkspace}
                defaultWorkspaceId={workspaceFromUrl || undefined}
              />

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
                  id="subject"
                  placeholder="Enter email subject"
                  {...methods.register("subject")}
                />
                {methods.formState.errors.subject && (
                  <span className="text-red-500">
                    {methods.formState.errors.subject.message}
                  </span>
                )}
              </div>

              {/* Skills Field */}
              <div className="space-y-2 my-4">
                <Label className="text-lg" htmlFor="skills">
                  Skills / Features (Optional)
                </Label>
                <Textarea
                  id="skills"
                  placeholder="List relevant skills or product features..."
                  {...methods.register("skills")}
                />
                {methods.formState.errors.skills && (
                  <span className="text-red-500">
                    {methods.formState.errors.skills.message}
                  </span>
                )}
              </div>

              {/* Email Tone */}
              <div className="space-y-2 my-4">
                <FormLabel className="text-lg">Email Tone</FormLabel>
                <RadioGroup
                  onValueChange={handleValueChange}
                  className=" flex flex-wrap "
                >
                  {[
                    "formal",
                    "informal",
                    "enthusiastic",
                    "concise",
                    "friendly",
                  ].map((tone) => (
                    <div key={tone} className="">
                      <RadioGroupItem
                        value={tone}
                        id={tone}
                        className="hidden"
                      />
                      <Label
                        htmlFor={tone}
                        className={clsx(
                          "block p-2 cursor-pointer rounded-full px-6 py-4 border-2 ",
                          selectedValue === tone ? "bg-gray-200 text-black" : ""
                        )}
                      >
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {methods.formState.errors.emailTone && (
                  <span className="text-red-500">
                    {methods.formState.errors.emailTone.message}
                  </span>
                )}
              </div>

              {/* Social Links Section */}
              <div className="space-y-4 my-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Social Links (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ platform: "", link: "" })}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`platform-${index}`}>Platform</Label>
                      <Input
                        id={`platform-${index}`}
                        placeholder="LinkedIn, Twitter, etc."
                        {...methods.register(`socialLinks.${index}.platform`)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`link-${index}`}>URL</Label>
                      <Input
                        id={`link-${index}`}
                        placeholder="https://..."
                        {...methods.register(`socialLinks.${index}.link`)}
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="mb-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {methods.formState.errors.socialLinks && (
                  <span className="text-red-500">
                    Please fill in both platform and link for all social links
                  </span>
                )}
              </div>

              {/* Model Selection */}
              <div className="space-y-2 my-4">
                <Label className="text-lg">AI Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Email"
                )}
              </Button>
            </form>
          </FormProvider>
        </Card>

        <Card className="p-6 my-4">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Generated Email</Label>

            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            )}

            {responseMessage && !isLoading && (
              <>
                <Textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="min-h-[calc(100vh-200px)] resize-none"
                />

                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Copy Email
                  </Button>

                  <Button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Template"
                    )}
                  </Button>

                  <Dialog>
                    <DialogTrigger
                      className="flex flex-row bg-white text-black px-3 py-2 font-sans font-semibold rounded-lg"
                      disabled={!responseMessage}
                    >
                      Send
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Recipients</DialogTitle>
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
                              <Button onClick={openClientWithEmail}>
                                Send
                              </Button>
                            </div>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}

            {!responseMessage && !isLoading && (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                Fill out the form and click "Generate Email" to create your
                template
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

// Main Page component with Suspense boundary
const Page: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <TemplateForm />
    </Suspense>
  );
};

export default Page;
