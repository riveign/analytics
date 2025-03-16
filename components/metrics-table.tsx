import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { metricsDefinitions } from "@/lib/metrics-data";

type Version = "V1" | "V2" | "V3";
type BadgeVariant = "outline" | "default" | "secondary" | "destructive";

interface VersionBadgeProps {
  variant: BadgeVariant;
  className: string;
}

export function MetricsTable() {
  // Flatten all metrics into a single array
  const allMetrics = [
    ...metricsDefinitions.sessionMetrics,
    ...metricsDefinitions.userBehavior,
    ...metricsDefinitions.chainMetrics,
    ...metricsDefinitions.technicalPerformance,
    ...metricsDefinitions.advancedAnalytics,
    ...metricsDefinitions.swapMetrics,
    ...metricsDefinitions.competitionMetrics,
  ];

  // Get all categories

  // Function to get category for a metric
  const getCategoryForMetric = (metricName: string) => {
    for (const [category, metrics] of Object.entries(metricsDefinitions)) {
      if (metrics.some((m: { name: string }) => m.name === metricName)) {
        return category
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
      }
    }
    return "Unknown";
  };

  // Function to get badge variant and class based on version
  const getVersionBadgeProps = (version: Version): VersionBadgeProps => {
    switch (version) {
      case "V1":
        return {
          variant: "outline",
          className: "bg-green-100 text-green-800 border-green-600",
        };
      case "V2":
        return {
          variant: "outline",
          className: "bg-blue-100 text-blue-800 border-blue-600",
        };
      case "V3":
        return {
          variant: "outline",
          className: "bg-orange-100 text-orange-800 border-orange-600",
        };
      default:
        return { variant: "outline", className: "" };
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Metrics Definitions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Category</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead>Explanation</TableHead>
            <TableHead>Visualization</TableHead>
            <TableHead>Version</TableHead>
            <TableHead className="text-right">Tier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allMetrics.map((metric, index) => {
            const versionBadgeProps = getVersionBadgeProps(
              metric.version as Version
            );
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {getCategoryForMetric(metric.name)}
                </TableCell>
                <TableCell>{metric.name}</TableCell>
                <TableCell>{metric.explanation}</TableCell>
                <TableCell>{metric.visualization}</TableCell>
                <TableCell>
                  <Badge
                    variant={versionBadgeProps.variant}
                    className={versionBadgeProps.className}
                  >
                    {metric.version}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={metric.tier === "Pro" ? "default" : "outline"}
                    className={metric.tier === "Pro" ? "bg-indigo-600" : ""}
                  >
                    {metric.tier}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
