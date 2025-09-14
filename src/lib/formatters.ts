/**
 * Format a number as Colombian Peso (COP)
 * @param value The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a change value with plus/minus sign and color indication
 * @param value The change value
 * @returns Object with formatted value and CSS color class
 */
export const formatChange = (
  value: number
): { formatted: string; colorClass: string } => {
  const prefix = value > 0 ? "+" : "";
  const colorClass =
    value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600";

  return {
    formatted: `${prefix}${formatCurrency(value)}`,
    colorClass,
  };
};

/**
 * Formats a given date into a string using the "es-CO" locale.
 *
 * The formatted date will have the day and month as two digits and the year as numeric.
 *
 * @param date - The date to format.
 * @returns The formatted date string in "DD/MM/YYYY" format according to the "es-CO" locale.
 *
 * @example
 * ```typescript
 * formatDate(new Date(2024, 5, 9)); // "09/06/2024"
 * ```
 */
export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};
