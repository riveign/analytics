import { Button } from "@/components/ui/button";

interface UpgradeBannerProps {
  setIsPro: (value: boolean) => void;
}

export function UpgradeBanner({ setIsPro }: UpgradeBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-6 mb-6">
      <p className="text-blue-800 font-medium mb-4 sm:mb-0">
        Upgrade to Pro for advanced analytics and deeper insights!
      </p>
      <Button
        className="bg-indigo-700 hover:bg-indigo-800"
        onClick={() => setIsPro(true)}
      >
        Upgrade Now
      </Button>
    </div>
  );
}
