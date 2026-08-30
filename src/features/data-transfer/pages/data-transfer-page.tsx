import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExportLedgerData } from "./hooks/use-export-ledger-data";
import { useImportLedgerData } from "./hooks/use-import-ledger-data";

export const DataTransferPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportData, isPending: isExporting } = useExportLedgerData();
  const {
    importData,
    isPending: isImporting,
    isSuccess: isImportSuccess,
    error: importError,
  } = useImportLedgerData();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
    }
    event.target.value = "";
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Import / Export</h1>

      <Card>
        <CardHeader>
          <CardTitle>Export data</CardTitle>
          <CardDescription>
            Download all accounts and ledger entries as a JSON backup file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => exportData()} disabled={isExporting}>
            {isExporting ? "Exporting…" : "Export data"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import data</CardTitle>
          <CardDescription>
            Importing a file fully replaces all existing accounts and ledger entries. This
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleImportClick} variant="outline" disabled={isImporting}>
            {isImporting ? "Importing…" : "Import data"}
          </Button>
          {importError && (
            <p className="text-sm text-red-500">
              {importError instanceof Error ? importError.message : "Import failed."}
            </p>
          )}
          {isImportSuccess && !importError && (
            <p className="text-sm text-green-600">Data imported successfully.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
