import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CreateExpenseInputSchema } from "../../../entities/expense";

// Schema omits financialRecordId as it will be added when submitting
const formSchema = z.object({
  name: CreateExpenseInputSchema.shape.name,
  amount: CreateExpenseInputSchema.shape.amount,
});

type FormData = z.infer<typeof formSchema>;

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  // Reset form when dialog opens or closes
  /* React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]); */

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Expense Name</Label>
              <Input
                id="name"
                placeholder="Enter expense name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (COP)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                {...register("amount", { valueAsNumber: true })}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
