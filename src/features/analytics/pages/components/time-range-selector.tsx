import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TIME_RANGE_LABELS,
  TIME_RANGE_OPTIONS,
  TimeRange,
} from "@/features/analytics/lib/time-range";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export const TimeRangeSelector = ({ value, onChange }: TimeRangeSelectorProps) => {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="analytics-time-range">Time range</Label>
      <Select value={value} onValueChange={(next) => onChange(next as TimeRange)}>
        <SelectTrigger id="analytics-time-range" className="w-48" aria-label="Time range">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIME_RANGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {TIME_RANGE_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
