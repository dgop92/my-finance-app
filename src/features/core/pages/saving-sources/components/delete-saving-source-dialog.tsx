import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SavingsSource } from "@/features/core/entities/saving-source";
import { useDeleteSavingSource } from "../hooks/delete-saving-source-hook";

interface DeleteSavingsSourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  savingsSource: SavingsSource;
}

export const DeleteSavingsSourceDialog = ({
  isOpen,
  onClose,
  savingsSource,
}: DeleteSavingsSourceDialogProps) => {
  const { handleConfirm } = useDeleteSavingSource({
    onClose,
    savingsSource,
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Savings Source</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this savings source? Any associated
            values will be transferred to the "NA" savings source. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
