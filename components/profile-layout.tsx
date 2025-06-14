"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserDetails } from "@/actions/actions";

export function ProfileLayout() {
  const { data }: any = useSession();
  const [user, setUser] = useState<any>([]);

  const fetchUser = async () => {
    const user = await fetchUserDetails();
    if (user) {
      setUser(user);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const checkStatus = (): number => {
    if (user.subscription == "free") {
      return 8;
    } else if (user.subscription == "pro") {
      return 20;
    }
    return 0;
  };

  return (
    <div className="w-full space-y-4  grid grid-cols-1 m-2 md:grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-2 md:flex items-center p-6">
        <CardHeader>
          <div className="flex items-center gap-4 md:border-r-2 md:pr-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={data?.user?.image!} />
              <AvatarFallback>{data?.user?.name![0]}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="text-xl font-semibold">{data?.user?.name}</div>
              <div className="text-sm text-muted-foreground">
                {data?.user?.email}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2  w-full">
          <div className="grid gap-2">
            <div className="flex flex-col items-start gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                Saved Templates
              </div>
              <div className="text-2xl font-bold">{user.savedEmails}</div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-medium text-muted-foreground">
              Subscription Plan
            </div>
            <div className="text-2xl font-bold">
              {String(user.subscription).charAt(0).toUpperCase() +
                String(user.subscription).slice(1)}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="text-sm font-medium text-muted-foreground">
              Current Plan Capacity
            </div>
            <div className="text-2xl font-bold">
              {checkStatus() == 0 ? (
                "Unlimited"
              ) : (
                <p>
                  {user.totalEmails} / {checkStatus()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past payments and subscription details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2023-04-01</TableCell>
                <TableCell>$49.99</TableCell>
                <TableCell>Pro</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-03-01</TableCell>
                <TableCell>$49.99</TableCell>
                <TableCell>Pro</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-02-01</TableCell>
                <TableCell>$49.99</TableCell>
                <TableCell>Pro</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2023-01-01</TableCell>
                <TableCell>$49.99</TableCell>
                <TableCell>Pro</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
