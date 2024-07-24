import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { onPaymentSuccess } from "@/actions/actions";

export async function POST(req: any, res: NextResponse) {
  const data = await req.formData();
  const userId = req.nextUrl.searchParams.get("userId");
  const status = data.get("code");
  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");

  const st =
    `/pg/v1/status/${merchantId}/${transactionId}` +
    process.env.NEXT_PUBLIC_SALT_KEY;
  // console.log(st)
  const dataSha256 = sha256(st);

  const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;
  console.log(checksum);

  const options = {
    method: "GET",
    url: `${process.env.UAT_PAY_API_URL}/status/${merchantId}/${transactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  // CHECK PAYMENT STATUS
  const response = await axios.request(options);

  if (response.data.code == "PAYMENT_SUCCESS") {
    if (response.data.data.amount === 9900) {
      console.log("Pro plan");
      const user = await onPaymentSuccess("pro", userId);
      console.log(user);
    } else if (response.data.data.amount === 14900) {
      console.log("Premium plan");
      const user = await onPaymentSuccess("premium", userId);
      console.log(user);
    }
    return NextResponse.redirect("http://localhost:3000/success", {
      status: 301,
    });
  } else
    return NextResponse.redirect("http://localhost:3000/failure", {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    });
}
