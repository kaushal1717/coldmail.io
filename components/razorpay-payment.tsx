"use client";

import { useCallback, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  userId: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

export default function RazorpayPayment({
  amount,
  userId,
  onSuccess,
  onError,
}: RazorpayPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = useCallback(async () => {
    try {
      setIsLoading(true);

      // Create order
      const response = await fetch("/api/razorpay/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();

      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Coldmail.io",
          description: "Subscription Payment",
          order_id: data.order.id,
          handler: function (response: any) {
            onSuccess(response);
          },
          prefill: {
            name: "User",
            email: "user@example.com",
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response: any) {
          setIsLoading(false);
          onError(response.error);
        });

        razorpay.open();
      };

      script.onerror = () => {
        setIsLoading(false);
        onError(new Error("Failed to load Razorpay script"));
      };

      document.body.appendChild(script);

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (error) {
      setIsLoading(false);
      console.error("Payment initialization failed:", error);
      onError(error);
    }
  }, [amount, userId, onSuccess, onError]);

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
}
