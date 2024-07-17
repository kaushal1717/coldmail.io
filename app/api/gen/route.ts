import { NextResponse } from "next/server";
import { groq } from "@/helper/groq.helper";
import { emailFormType } from "@/app/templates/new/page";

export async function POST(request: Request) {
  const {
    senderName,
    emailTone,
    emailPurpose,
    subject,
    socialLinks,
    skills,
  }: emailFormType = await request.json();

  let links: string = socialLinks
    .map((socialLink) => `${socialLink.platform}: ${socialLink.link}`)
    .join(", ");

  let givenFactors: string[] = [
    "1. Generate only body of email",
    `2. DO NOT include ANY introductory phrases such as "Here is the email:", "The email is as follows:", "Here's the generated email:", or ANY similar variations. Start directly with the email content`,
    "3. DO NOT include the subject line",
    "4. Start email with salutation dear xyz or respected xyz",
    `5. In the closing paragraph, before "Sincerely," ${
      socialLinks && socialLinks.length > 0
        ? `include this exact text: "You can reach me at the following: ${links}"`
        : "do NOT mention any social links."
    }.`,
  ];

  let factors: string = givenFactors.map((factor) => `${factor}`).join("\n");

  let promptString = `generate an email by ${senderName} for ${emailPurpose} for ${subject} with the skills in ${skills} and set the tone of email as ${emailTone}, and strictly consider following factors: \n ${factors}. \nPlease take care of all these factors while generating mail`;
  const generator = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: promptString,
      },
    ],
    model: "llama3-70B-8192",
  });
  console.log(promptString);
  return NextResponse.json({ generator });
}
