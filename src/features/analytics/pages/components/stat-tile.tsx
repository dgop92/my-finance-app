import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  title: string;
  value: string;
  negative?: boolean;
}

export const StatTile = ({ title, value, negative }: StatTileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className={cn("text-2xl font-bold tabular-nums", negative && "text-red-600")}>
          {value}
        </span>
      </CardContent>
    </Card>
  );
};
