import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, Edit } from "lucide-react";
import { PATHS } from "@/lib/paths";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatChange, formatDate } from "@/lib/formatters";
import {
  calculateFinancialRecordDifference,
  calculateTotal,
} from "@/features/core/services/financial-functions";
import { financialRecordRepository } from "@/features/core/repositories/repository.factory";

const FinancialRecordsList = () => {
  // Fetch financial records
  const { data, isLoading } = useQuery({
    queryKey: ["financialRecords"],
    queryFn: () => financialRecordRepository.getMany(),
  });

  // Navigate to create page
  const navigate = useNavigate();
  const handleOpenCreateDialog = () => navigate(PATHS.FINANCIAL_RECORD_CREATE);

  const financialRecords = data || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Financial Records</h1>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Record
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <p>Loading financial records...</p>
        </div>
      ) : (
        <>
          {/* Desktop view - Table */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Change from Previous</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialRecords.length > 0 ? (
                      financialRecords.map((record, index) => {
                        const total = calculateTotal(record);
                        const current = record;
                        // remember, it is sorted by date descending
                        const previous = financialRecords[index + 1];
                        const difference = calculateFinancialRecordDifference({
                          current,
                          previous,
                        });
                        const { formatted, colorClass } = formatChange(
                          difference.amount
                        );

                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {formatDate(record.createdAt)}
                            </TableCell>
                            <TableCell>{formatCurrency(total)}</TableCell>
                            <TableCell className={colorClass}>
                              {formatted} ({difference.percentage.toFixed(2)}%)
                            </TableCell>
                            <TableCell>
                              {formatDate(record.updatedAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  aria-label="View Details"
                                  asChild
                                >
                                  <Link to={`/financial-records/${record.id}`}>
                                    <FileText className="h-4 w-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  aria-label="Edit Record"
                                  asChild
                                >
                                  <Link
                                    to={`/financial-records/${record.id}/edit`}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No financial records found. Create your first record!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-4">
            {financialRecords && financialRecords.length > 0 ? (
              financialRecords.map((record, index) => {
                const total = calculateTotal(record);
                const current = record;
                const previous = financialRecords[index + 1];
                const difference = calculateFinancialRecordDifference({
                  current,
                  previous,
                });
                const { formatted, colorClass } = formatChange(
                  difference.amount
                );

                return (
                  <Card key={record.id} className="w-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {formatDate(record.createdAt)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Total:
                          </span>
                          <span className="text-lg font-bold">
                            {formatCurrency(total)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Change:
                          </span>
                          <span className={`text-sm font-medium ${colorClass}`}>
                            {formatted} ({difference.percentage.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Updated:
                          </span>
                          <span className="text-sm">
                            {formatDate(record.updatedAt)}
                          </span>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/financial-records/${record.id}`}>
                              <FileText className="h-4 w-4 mr-2" />
                              Details
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/financial-records/${record.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  No financial records found. Create your first record!
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export { FinancialRecordsList };
