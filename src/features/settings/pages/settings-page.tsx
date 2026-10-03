import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { useSettings } from "./hooks/use-settings";
import { SettingsForm } from "./components/settings-form";

export const SettingsPage = () => {
  const { data: settings, isPending, error } = useSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Net salary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isPending && <p className="text-muted-foreground">Loading settings…</p>}
          {error && (
            <p className="text-red-500">Failed to load settings: {error.message}</p>
          )}
          {settings && (
            <>
              <p className="text-sm text-muted-foreground">
                Current value: <span className="tabular-nums">{formatCurrency(settings.netSalary)}</span>
              </p>
              <SettingsForm settings={settings} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
