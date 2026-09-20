import { Button } from "@/components/ui/button";
import { useCreateExpense } from "../hooks/use-create-expense";
import { ExpenseFormFields } from "./expense-form-fields";

export const CreateExpenseForm = () => {
  const {
    register,
    control,
    handleFormSubmit,
    formState: { errors },
    error: createError,
  } = useCreateExpense();

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <ExpenseFormFields
        idPrefix="create-expense"
        register={register}
        control={control}
        errors={errors}
      />
      <div>
        <Button type="submit">Add expense</Button>
      </div>
      {createError && <p className="text-sm text-red-500">{createError.message}</p>}
    </form>
  );
};
