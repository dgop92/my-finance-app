import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAccountForm } from "./components/create-account-form";
import { AccountList } from "./components/account-list";

export const AccountsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Accounts</h1>

      <Card>
        <CardHeader>
          <CardTitle>New account</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateAccountForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountList />
        </CardContent>
      </Card>
    </div>
  );
};
