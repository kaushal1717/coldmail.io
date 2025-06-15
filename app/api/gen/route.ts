import { NextResponse } from "next/server";
import { groq } from "@/lib/groq.helper";
import { emailFormType } from "@/app/(client)/templates/new/page";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/upstash";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "120s"),
});

export async function POST(request: Request) {
  const ip = headers().get("x-forwarded-for");
  const { success } = await ratelimit.limit(ip!);

  if (!success)
    return NextResponse.json({
      ratelimited:
        "Unable to process the request, limit reached wait for 2 minutes",
    });

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
    "2. DO NOT include ANY introductory phrases such as: here is the email:, The email is as follows:, Here's the generated email:, or ANY similar variations. Start directly with the email content",
    "3. DO NOT include the subject line",
    "4. Start email with salutation dear xyz or respected xyz",
    "5. Start with Dear and the recipient only",
    `6. In the closing paragraph, before "Sincerely," ${
      socialLinks && socialLinks.length > 0
        ? `include this exact text: "You can reach me at the following: ${links}"`
        : "do NOT mention any social links."
    }.`,
  ];

  let factors: string = givenFactors.map((factor) => `${factor}`).join("\n");

  let purposeSpecificPrompt: string;
  let skillsOrFeaturesField: string = "";

  switch (emailPurpose) {
    case "follow-up":
      purposeSpecificPrompt = `Purpose of the email is :
      Write a follow-up email to a previous application or conversation. Key points are - 
      - mention the previous conversation briefly
      - Politely ask about the current status or the next procedure.`;
      break;
    case "to-ceo":
      purposeSpecificPrompt = `Purpose of the email is : Compose the email addressed to CEO. Key Points are- 
        - Be respectful and get straight to the point.
        - Highlight the most important request or information.`;
      skillsOrFeaturesField = `SKILLS TO HIGHLIGHT: ${skills}`;
      break;
    case "job-application":
      purposeSpecificPrompt = ` Purpose of the mail is : Draft a job application mail. Consider these key points - 
        - Highlight your key skills and experiences that match the job requirements.
        - Express your interest for the position and company.`;
      skillsOrFeaturesField = `SKILLS TO HIGHLIGHT: ${skills}`;
      break;
    case "product-promotion":
      purposeSpecificPrompt = ` Purpose of the email is : Compose an email for promoting a product. Consider these key points -
        - Highlight the key features and benefits of product
        - Explain how the product can solve a problem or improve the recipient's life/business in 1-2 paragraph`;
      skillsOrFeaturesField = `PRODUCT FEATURES : ${skills}`;
      break;
    case "referrals":
      purposeSpecificPrompt = `Purpose of the email is : Create a referral email introducting yourself. Consider these key points - 
        - Briefly describe why you are reaching the person out
        - Higlight how your skills are relevant for the given job position.
      
      `;
  }

  let promptString = `Task : generate the email body 
    SENDER : ${senderName}
    ${purposeSpecificPrompt}
    SUBJECT : ${subject}
    ${skillsOrFeaturesField}
    TONE: ${emailTone}
    CRITICAL INSTRUCTIONS : ${givenFactors}.
    Please ensure the content and tone of the email align with given purpose and tone.
  `;
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
