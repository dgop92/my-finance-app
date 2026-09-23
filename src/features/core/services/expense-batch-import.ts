import { z } from "zod";
import { CreateExpenseInput, ExpenseTypeSchema } from "@/features/core/entities/expense";
import { formatFormDate, parseFormDate } from "@/lib/form-date";

const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Reuses the same local-date parsing as the manual form (parseFormDate) so a
// "YYYY-MM-DD" string can't shift a day in negative-offset timezones, then
// formats it back to catch calendar-invalid values (e.g. 2026-02-30) that
// `new Date(y, m, d)` would otherwise silently roll over into March.
function isValidCalendarDate(value: string): boolean {
  return DATE_FORMAT_REGEX.test(value) && formatFormDate(parseFormDate(value)) === value;
}

const ExpenseImportRowSchema = z.object({
  amount: z.number().int().positive(),
  type: ExpenseTypeSchema,
  date: z
    .string()
    .regex(DATE_FORMAT_REGEX, "must be a YYYY-MM-DD date")
    .refine(isValidCalendarDate, "must be a valid calendar date"),
});

function formatIssue(issue: z.ZodIssue): string {
  const field = issue.path.join(".");
  return field ? `${field}: ${issue.message}` : issue.message;
}

export interface ExpenseBatchImportRowError {
  // 1-based row number for user-facing display; null when the whole input
  // (not an individual row) failed validation.
  row: number | null;
  reasons: string[];
}

export type ExpenseBatchImportResult =
  | { success: true; expenses: CreateExpenseInput[] }
  | { success: false; errors: ExpenseBatchImportRowError[] };

export class ExpenseBatchImportValidationError extends Error {
  constructor(public readonly errors: ExpenseBatchImportRowError[]) {
    super("Batch import validation failed.");
    this.name = "ExpenseBatchImportValidationError";
  }
}

// Validates the entire array before returning anything usable, so a caller
// never partially imports: either every row is valid or nothing is.
export function parseExpenseBatchImport(raw: unknown): ExpenseBatchImportResult {
  if (!Array.isArray(raw)) {
    return {
      success: false,
      errors: [{ row: null, reasons: ["Input must be a JSON array of expenses."] }],
    };
  }

  const errors: ExpenseBatchImportRowError[] = [];
  const expenses: CreateExpenseInput[] = [];

  raw.forEach((row, index) => {
    const result = ExpenseImportRowSchema.safeParse(row);
    if (!result.success) {
      errors.push({
        row: index + 1,
        reasons: result.error.issues.map(formatIssue),
      });
      return;
    }
    expenses.push({
      amount: result.data.amount,
      type: result.data.type,
      date: parseFormDate(result.data.date),
      notes: "",
    });
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, expenses };
}
