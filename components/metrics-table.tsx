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

export function MetricsTable() {
  // Flatten all metrics into a single array
  const allMetrics = [
    ...metricsDefinitions.sessionMetrics,
    ...metricsDefinitions.userBehavior,
    ...metricsDefinitions.chainMetrics,
    ...metricsDefinitions.technicalPerformance,
    ...metricsDefinitions.advancedAnalytics,
    ...metricsDefinitions.swapMetrics,
  ];

  // Get all categories
  const categories = Object.keys(metricsDefinitions).map((key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  });

  // Function to get category for a metric
  const getCategoryForMetric = (metricName: string) => {
    for (const [category, metrics] of Object.entries(metricsDefinitions)) {
      if (metrics.some((m: any) => m.name === metricName)) {
        return category
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
      }
    }
    return "";
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
            <TableHead className="text-right">Tier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allMetrics.map((metric, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {getCategoryForMetric(metric.name)}
              </TableCell>
              <TableCell>{metric.name}</TableCell>
              <TableCell>{metric.explanation}</TableCell>
              <TableCell>{metric.visualization}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={metric.tier === "Pro" ? "default" : "outline"}
                  className={metric.tier === "Pro" ? "bg-indigo-600" : ""}
                >
                  {metric.tier}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
