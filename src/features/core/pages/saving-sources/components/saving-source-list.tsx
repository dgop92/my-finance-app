import { Button } from "@/components/ui/button";
import { SavingsSource } from "@/features/core/entities/saving-source";
import { CreateSavingsSourceDialog } from "./create-savings-source-dialog";
import { UpdateSavingsSourceDialog } from "./update-savings-source-dialog";
import { DeleteSavingsSourceDialog } from "./delete-saving-source-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { useSavingSourceList } from "../hooks/saving-source-list-hook";

export const SavingsSourceList = () => {
  const {
    isPending,
    error,
    savingsSources,
    isAddModalOpen,
    setIsAddModalOpen,
    savingSourceForEdition,
    setSavingSourceForEdition,
    savingSourceForDeletion,
    setSavingSourceForDeletion,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
  } = useSavingSourceList();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Savings Sources</CardTitle>
          <Button onClick={handleAddClick} className="inline-flex items-center">
            <PlusIcon className="mr-1 h-4 w-4" />
            Add New Source
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 border border-red-400 bg-red-100 text-red-700 rounded flex justify-between items-center">
              <span>Oops, something went wrong</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-700 h-auto p-1"
              >
                ✕
              </Button>
            </div>
          )}

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savingsSources.map((source: SavingsSource) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">
                      {source.name}
                      {source.isNA && (
                        <Badge className="ml-2 bg-blue-500">
                          Special Source
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(source)}
                        disabled={source.isNA}
                        aria-label={`Edit ${source.name}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(source)}
                        disabled={source.isNA}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete ${source.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            {savingsSources.map((source: SavingsSource) => (
              <div
                key={source.id}
                className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{source.name}</div>
                  {source.isNA && (
                    <Badge className="mt-1 bg-blue-500">Special Source</Badge>
                  )}
                </div>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(source)}
                    disabled={source.isNA}
                    aria-label={`Edit ${source.name}`}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(source)}
                    disabled={source.isNA}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete ${source.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {isPending && (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateSavingsSourceDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {!!savingSourceForEdition && (
        <UpdateSavingsSourceDialog
          isOpen={!!savingSourceForEdition}
          onClose={() => setSavingSourceForEdition(null)}
          savingsSource={savingSourceForEdition}
        />
      )}

      {!!savingSourceForDeletion && (
        <DeleteSavingsSourceDialog
          isOpen={!!savingSourceForDeletion}
          onClose={() => setSavingSourceForDeletion(null)}
          savingsSource={savingSourceForDeletion}
        />
      )}
    </div>
  );
};
