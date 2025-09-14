import { SavingSourceFormBase } from "./saving-source-form-base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateSavingSource } from "../hooks/create-savings-source-hook";

interface CreateSavingsSourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSavingsSourceDialog = ({
  isOpen,
  onClose,
}: CreateSavingsSourceDialogProps) => {
  const {
    register,
    handleFormSubmit,
    formState: { errors },
  } = useCreateSavingSource({ onClose });

  return (
    <SavingSourceFormBase
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Savings Source"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Enter savings source name"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </SavingSourceFormBase>
  );
};
