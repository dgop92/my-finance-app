import { Card, CardContent } from "@/components/ui/card";
import { CreateFinancialRecordForm } from "./components/create-financial-record-form";

const FinancialRecordCreatePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Financial Record</h1>
      <Card>
        <CardContent className="pt-6">
          <CreateFinancialRecordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export { FinancialRecordCreatePage };
