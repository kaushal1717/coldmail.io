"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "./footer";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const router = useRouter();

  const paymentHandler = async (amount: number) => {
    const transactionId = "Tr-" + uuidv4().toString().slice(-27);
    const payload = {
      merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: "MUID-" + uuidv4().toString().slice(-30),
      amount: amount * 100,
      redirectUrl: `http://localhost:3000/api/status/${transactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/status/${transactionId}`,
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const dataPayload = JSON.stringify(payload);
    console.log("Payload in json : " + dataPayload);

    const dataBase64 = Buffer.from(dataPayload).toString("base64");
    console.log("base64 Payload : " + dataBase64);

    const fullURL =
      dataBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY;
    const dataSha256 = sha256(fullURL);

    const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;
    console.log("c====", checksum);

    const response = await axios.post(
      process.env.NEXT_PUBLIC_UAT_PAY_API_URL as string,
      {
        request: dataBase64,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );

    const redirect = response.data.data.instrumentResponse.redirectInfo.url;
    router.push(redirect);
  };
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 bg-opacity-50 shadow-gray-700">
        <div className="container max-w-6xl px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pricing Plans
            </h2>
            <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Affordable, flexible and tailored to your needs.
            </p>
            <Button
              variant="outline"
              className="rounded-3xl mt-5 font-semibold border-gray-500"
            >
              Try the custom and pro plan with our 30-day FREE TRIAL!!
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-[#020817] p-6">
              <div className="mb-6 space-y-2">
                <h3 className="text-2xl font-bold">Starter</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Perfect for individuals and small teams.
                </p>
              </div>
              <div className="mb-6 space-y-2">
                <p className="text-4xl font-bold">Free</p>
              </div>
              <ul className="mb-6 space-y-2 text-gray-500 dark:text-gray-400">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />
                  10 GB storage
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />1 user
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />
                  Basic features
                </li>
              </ul>
              <Button className="w-full mt-14">Get Started</Button>
            </div>
            <div className="rounded-lg border bg-[#020817] p-6">
              <div className="mb-6 space-y-2">
                <h3 className="text-2xl font-bold">Custom</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Perfect for growing teams and businesses.
                </p>
              </div>
              <div className="mb-6 space-y-2">
                <p className="text-4xl font-bold">₹99</p>
                <p className="text-gray-500 dark:text-gray-400">per month</p>
              </div>
              <ul className="mb-6 space-y-2 text-gray-500 dark:text-gray-400">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />
                  100 GB storage
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />5 users
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />
                  Advanced features
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  paymentHandler(99);
                }}
              >
                Get Started
              </Button>
            </div>
            <div className="rounded-lg border bg-[#020817] p-6">
              <div className="mb-6 space-y-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Perfect for large teams and organizations.
                </p>
              </div>
              <div className="mb-6 space-y-2">
                <p className="text-4xl font-bold">₹149</p>
                <p className="text-gray-500 dark:text-gray-400">per month</p>
              </div>
              <ul className="mb-6 space-y-2 text-gray-500 dark:text-gray-400">
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />1 TB
                  storage
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />
                  Unlimited users
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 fill-primary" />
                  Enterprise features
                </li>
              </ul>
              <Button className="w-full" onClick={() => paymentHandler(149)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
