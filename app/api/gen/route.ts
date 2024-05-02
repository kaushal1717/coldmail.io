import { NextResponse } from 'next/server'
import { groq } from '@/helper/groq.helper'

export async function GET(request: Request) {
    const generator = await groq.chat.completions.create({
        messages:[
            {
                role: 'user',
                content: "generate an email for mern stack developer position as I am a fresher developer for a compay named google",
            }
        ],
        model: "llama3-8b-8192"
    })
    return NextResponse.json({generator});
}