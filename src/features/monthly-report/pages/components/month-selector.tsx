import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportMonth } from "@/features/core/services/monthly-report";
import { formatReportMonth, monthKey } from "@/features/monthly-report/lib/report-months";

interface MonthSelectorProps {
  months: ReportMonth[];
  value: ReportMonth;
  onChange: (key: string) => void;
}

export const MonthSelector = ({ months, value, onChange }: MonthSelectorProps) => {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="monthly-report-month">Month</Label>
      <Select value={monthKey(value)} onValueChange={onChange}>
        <SelectTrigger id="monthly-report-month" className="w-48" aria-label="Month">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={monthKey(month)} value={monthKey(month)}>
              {formatReportMonth(month)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
