import { Switch } from "@/components/ui/switch";

interface DashboardHeaderProps {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
}

export function DashboardHeader({ isPro, setIsPro }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-border">
      <h1 className="text-2xl font-semibold text-foreground mb-4 sm:mb-0">
        Analytics Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <span
          className={`text-sm ${
            !isPro ? "font-semibold text-foreground" : "text-muted-foreground"
          }`}
        >
          Free
        </span>
        <Switch
          checked={isPro}
          onCheckedChange={setIsPro}
          className="data-[state=checked]:bg-indigo-600"
        />
        <span
          className={`text-sm ${
            isPro ? "font-semibold text-foreground" : "text-muted-foreground"
          }`}
        >
          Pro
        </span>
      </div>
    </header>
  );
}
