import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateEntryForm } from "./components/create-entry-form";
import { EntryList } from "./components/entry-list";

export const LedgerEntriesPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Entries</h1>

      <Card>
        <CardHeader>
          <CardTitle>New entry</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateEntryForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All entries</CardTitle>
        </CardHeader>
        <CardContent>
          <EntryList />
        </CardContent>
      </Card>
    </div>
  );
};
