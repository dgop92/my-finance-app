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
import { UpdateExpenseInputSchema } from "../../../entities/expense";

// Schema for the form
const formSchema = z.object({
  name: UpdateExpenseInputSchema.shape.name,
  amount: UpdateExpenseInputSchema.shape.amount,
});

type FormData = z.infer<typeof formSchema>;

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  initialData: {
    name: string;
    amount: number;
  };
}

export const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Reset form with initialData when dialog opens or initialData changes
  /* React.useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    }
  }, [open, initialData, reset]); */

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
