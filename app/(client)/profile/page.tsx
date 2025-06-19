import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import UserInfoSection from "./_components/UserInfoSection";
import UserStatsSection from "./_components/UserStatsSection";
import SectionLoader from "./_components/SectionLoader";
import { Suspense } from "react";
import { fetchUserDetails } from "@/actions/actions";

export default async function ProfilePage() {
  const user = await fetchUserDetails();
  return (
    <div className="w-full space-y-4  grid grid-cols-1 m-2 md:grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-2 md:flex items-center p-6">
        <CardHeader>
          <Suspense fallback={<SectionLoader />}>
            <UserInfoSection />
          </Suspense>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2  w-full">
          <Suspense fallback={<SectionLoader />}>
            <UserStatsSection user={user ?? {}} />
          </Suspense>
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
