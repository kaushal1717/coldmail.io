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
  let links: string = "";
  socialLinks.forEach((element) => {
    links += element + ",";
  });
  let promptString = `generate an email by ${senderName} for ${emailPurpose} with subject as ${subject} with the skills in ${skills}  and set the tone of email as ${emailTone}, include social links -${links} make sure the length is concise and not lengthy, please generate only body of the email without any final notes or anything`;
  const generator = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: promptString,
      },
    ],
    model: "llama3-8b-8192",
  });
  return NextResponse.json({ generator });
}
