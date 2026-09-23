import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExpenseBatchImportValidationError } from "@/features/core/services/expense-batch-import";
import { useBatchImportExpenses } from "../hooks/use-batch-import-expenses";

export const BatchImportExpensesForm = () => {
  const [jsonText, setJsonText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importExpenses, isPending, isSuccess, importedCount, error, reset } =
    useBatchImportExpenses();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      importExpenses(file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(event.target.value);
    reset();
  };

  const handlePasteImport = () => {
    importExpenses(jsonText, { onSuccess: () => setJsonText("") });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="batch-import-file">Upload a JSON file</Label>
        <input
          id="batch-import-file"
          type="file"
          accept=".json,application/json"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="batch-import-text">Or paste JSON</Label>
        <Textarea
          id="batch-import-text"
          rows={6}
          value={jsonText}
          onChange={handleTextChange}
          placeholder='[{"amount": 15000, "type": "groceries", "date": "2026-01-15"}]'
        />
      </div>

      <div>
        <Button onClick={handlePasteImport} disabled={isPending || !jsonText.trim()}>
          {isPending ? "Importing…" : "Import from pasted JSON"}
        </Button>
      </div>

      {isSuccess && (
        <p className="text-sm text-green-600">
          Imported {importedCount} expense{importedCount === 1 ? "" : "s"}.
        </p>
      )}

      {error instanceof ExpenseBatchImportValidationError && (
        <div className="text-sm text-red-500">
          <p>Import failed. Fix the following and try again:</p>
          <ul className="list-disc pl-5">
            {error.errors.map((rowError) => (
              <li key={rowError.row ?? "input"}>
                {rowError.row === null ? "Input" : `Row ${rowError.row}`}:{" "}
                {rowError.reasons.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && !(error instanceof ExpenseBatchImportValidationError) && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
