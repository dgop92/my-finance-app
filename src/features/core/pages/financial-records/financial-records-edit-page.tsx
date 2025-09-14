import { UpdateFinancialRecordForm } from "./components/update-financial-record-form";

const FinancialRecordsEditPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Financial Record</h1>
        <p className="text-muted-foreground">
          Update the values for your financial record
        </p>
      </div>
      <UpdateFinancialRecordForm />
    </div>
  );
};

export { FinancialRecordsEditPage };
