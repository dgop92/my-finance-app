import React, { useRef, useState } from "react";
import { Download, Upload, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  convertFinancialRecordDates,
  convertSavingsSourceDates,
  loadFinancialRecords,
  loadSavingsSources,
  saveFinancialRecords,
  saveSavingsSources,
} from "@/features/core/repositories/local-storage.memory";
import { FinancialRecord } from "@/features/core/entities/financial-record";
import { SavingsSource } from "@/features/core/entities/saving-source";

interface DataFile {
  financialRecords: FinancialRecord[];
  savingsSources: SavingsSource[];
}

export function ImportExportPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [alertState, setAlertState] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleExport = () => {
    try {
      // Get the current data from localStorage
      const financialRecords = loadFinancialRecords();
      const savingsSources = loadSavingsSources();

      // Create the export data structure
      const exportData: DataFile = {
        financialRecords,
        savingsSources,
      };

      // Convert to a JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create and trigger a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `finance-app-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the URL object
      URL.revokeObjectURL(url);

      setAlertState({
        type: "success",
        message: "Data exported successfully!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setAlertState({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Export failed:", error);
      setAlertState({
        type: "error",
        message: `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  };

  const handleImportClick = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content) as DataFile;

        // Validate the structure of the imported data
        if (
          !importedData.financialRecords ||
          !importedData.savingsSources ||
          !Array.isArray(importedData.financialRecords) ||
          !Array.isArray(importedData.savingsSources)
        ) {
          throw new Error(
            "Invalid file format. Expected 'financialRecords' and 'savingsSources' arrays."
          );
        }

        // Process date strings to Date objects
        const processedData: DataFile = {
          financialRecords: importedData.financialRecords.map(
            convertFinancialRecordDates
          ),
          savingsSources: importedData.savingsSources.map(
            convertSavingsSourceDates
          ),
        };

        // Save to localStorage
        saveFinancialRecords(processedData.financialRecords);
        saveSavingsSources(processedData.savingsSources);

        setAlertState({
          type: "success",
          message: "Data imported successfully!",
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setAlertState({ type: null, message: "" });
        }, 3000);
      } catch (error) {
        console.error("Import failed:", error);
        setAlertState({
          type: "error",
          message: `Import failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import / Export</h1>
        <p className="text-muted-foreground">
          Export your data or import previously exported data.
        </p>
      </div>

      {alertState.type && (
        <div
          className={`p-4 rounded-md ${
            alertState.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          } mb-4`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {alertState.type === "success" ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                {alertState.type === "success" ? "Success" : "Error"}
              </h3>
              <div className="mt-2 text-sm">
                <p>{alertState.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download all your financial records and savings sources as a JSON
              file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will export all your financial records and savings sources.
              You can use this file for backup or to import into another
              instance of the app.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Import previously exported financial records and savings sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will override all your existing data. Make sure to export
              your current data first if you want to keep it.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleImportClick}
              variant="outline"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
