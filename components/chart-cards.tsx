"use client";

import type React from "react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Treemap,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { analyticsData } from "@/lib/data";
import { Ribbon } from "@/components/ui/ribbon";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  height?: number;
  isPro?: boolean;
  version?: string;
}

interface MetricsCardsProps {
  isPro: boolean;
  dateFilter: "all" | "30" | "60" | "90" | "custom";
  customDateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

interface PaywallOverlayProps {
  title: string;
}

interface ChartDataPoint {
  date: string;
  free?: number;
  pro?: number;
  [key: string]: string | number | undefined;
}

interface SwapMetricsCardsProps extends MetricsCardsProps {
  swapsEnabled: boolean;
  setSwapsEnabled: (enabled: boolean) => void;
}

type UserSegmentType =
  | "Power Users"
  | "Regular Users"
  | "Casual Users"
  | "New Users";

interface UserSegment {
  avgSessionLength: number;
  avgActionsPerSession: number;
  commonActions: string[];
  retentionRate: number;
}

function PaywallOverlay({ title }: PaywallOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center text-center p-4 rounded-lg">
      <div className="bg-background/95 p-4 rounded-lg shadow-lg max-w-[80%]">
        <p className="text-sm font-medium mb-2">
          Want to know more about {title.toLowerCase()}?
        </p>
        <p className="text-xs text-muted-foreground">Upgrade to Pro</p>
      </div>
    </div>
  );
}

function filterDataByDate(
  data: ChartDataPoint[],
  dateFilter: MetricsCardsProps["dateFilter"],
  customDateRange: MetricsCardsProps["customDateRange"]
) {
  if (dateFilter === "all") return data;

  const now = new Date();

  if (dateFilter === "custom") {
    if (!customDateRange.startDate || !customDateRange.endDate) return data;
    return data.filter((item) => {
      const date = new Date(item.date);
      return (
        date >= customDateRange.startDate! && date <= customDateRange.endDate!
      );
    });
  }

  const filterDate = new Date(
    now.setDate(now.getDate() - parseInt(dateFilter))
  );
  return data.filter((item) => new Date(item.date) >= filterDate);
}

function ChartCard({
  title,
  children,
  height = 250,
  isPro,
  version = "V2",
}: ChartCardProps & { version?: "V1" | "V2" | "V3" }) {
  return (
    <Card className="overflow-hidden relative">
      <Ribbon version={version} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ height }}>{children}</CardContent>
    </Card>
  );
}

export function SessionMetricsCards({
  isPro,
  dateFilter,
  customDateRange,
}: MetricsCardsProps) {
  const filteredData = filterDataByDate(
    analyticsData.sessionMetrics.daily,
    dateFilter,
    customDateRange
  );

  return (
    <>
      <ChartCard title="Monthly Active Users (MAU)" height={400} version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData.sessionMetrics.activeUsers.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--chart-3))"
              name="Monthly Active Users"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Daily Sessions" height={400} version="V1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              name="Total Sessions"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Daily Active Users (DAU)"
        isPro
        height={400}
        version="V2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData.sessionMetrics.activeUsers.daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--chart-1))"
              name="Daily Active Users"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Daily Active Users" />}
      </ChartCard>

      <ChartCard
        title="Weekly Active Users (WAU)"
        isPro
        height={400}
        version="V2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData.sessionMetrics.activeUsers.weekly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--chart-2))"
              name="Weekly Active Users"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Weekly Active Users" />}
      </ChartCard>

      <ChartCard title="Country Distribution" height={400} version="V2">
        <ChartContainer
          config={{
            distribution: {
              label: "Distribution",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.sessionMetrics.countryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="hsl(var(--chart-1))"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.sessionMetrics.countryDistribution.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  )
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>

      <ChartCard title="Platform Distribution" height={400} version="V2">
        <ChartContainer
          config={{
            distribution: {
              label: "Distribution",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.sessionMetrics.platformDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="hsl(var(--chart-1))"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.sessionMetrics.platformDistribution.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  )
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Connection Channel Distribution"
        height={400}
        version="V1"
      >
        <ChartContainer
          config={{
            distribution: {
              label: "Distribution",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.sessionMetrics.channelDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="hsl(var(--chart-1))"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.sessionMetrics.channelDistribution.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  )
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        {!isPro && <PaywallOverlay title="Connection Channel Distribution" />}
      </ChartCard>

      <ChartCard title="Social Connection Types" height={400} version="V2">
        <ChartContainer
          config={{
            distribution: {
              label: "Distribution",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.sessionMetrics.socialTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                innerRadius={30}
                fill="hsl(var(--chart-1))"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.sessionMetrics.socialTypes.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  )
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        {!isPro && <PaywallOverlay title="Social Connection Types" />}
      </ChartCard>

      <ChartCard
        title="Connection Success Rate by Channel"
        height={400}
        version="V3"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.sessionMetrics.channelSuccessRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="success"
              fill="hsl(var(--chart-2))"
              name="Success Rate"
            />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && (
          <PaywallOverlay title="Connection Success Rate by Channel" />
        )}
      </ChartCard>

      <ChartCard
        title="Connection Method Distribution"
        height={400}
        version="V1"
      >
        <ChartContainer
          config={{
            distribution: {
              label: "Distribution",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.sessionMetrics.distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="hsl(var(--chart-1))"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.sessionMetrics.distribution.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  )
                )}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>

      <ChartCard title="Connection Success Rate (%)" height={400} version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.connectionMetrics.successRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="success"
              fill="hsl(var(--chart-2))"
              name="Success Rate"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Time to Connect (seconds)" height={400} version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.connectionMetrics.timeToConnect}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="time"
              fill="hsl(var(--chart-1))"
              name="Time (seconds)"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Connection Drop-off Points" height={400} version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData.connectionMetrics.dropOffPoints}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="point" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" fill="hsl(var(--chart-3))" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Connection Drop-off Points" />}
      </ChartCard>
    </>
  );
}

export function UserBehaviorCards({ isPro }: MetricsCardsProps) {
  const [selectedSegment, setSelectedSegment] =
    useState<UserSegmentType | null>(null);

  const userSegmentData = Object.entries(
    analyticsData.userBehavior.userSegments.details
  ).map(([segment, data]) => ({
    name: segment,
    retention: data.retentionRate,
    actions: data.avgActionsPerSession,
  }));

  return (
    <>
      <ChartCard title="Growth Accounting" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData.userBehavior.growthAccounting}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="new"
              stackId="a"
              fill="hsl(var(--chart-1))"
              name="New Users"
            />
            <Bar
              dataKey="returning"
              stackId="a"
              fill="hsl(var(--chart-2))"
              name="Returning Users"
            />
            <Bar
              dataKey="resurrecting"
              stackId="a"
              fill="hsl(var(--chart-3))"
              name="Resurrecting Users"
            />
            <Bar
              dataKey="dormant"
              stackId="a"
              fill="hsl(var(--chart-4))"
              name="Dormant Users"
            />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Growth Accounting" />}
      </ChartCard>

      <ChartCard title="Feature Usage" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData.userBehavior.featureUsage}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="feature" width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Feature Usage Analysis" />}
      </ChartCard>

      <ChartCard title="Average Time Spent (minutes)" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={analyticsData.userBehavior.timeSpent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Session Duration Analysis" />}
      </ChartCard>

      <ChartCard title="Return Rate Analysis" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.userBehavior.returnRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" fill="hsl(var(--chart-3))" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="User Retention Metrics" />}
      </ChartCard>

      <ChartCard title="Dwell Time Between Actions" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData.userBehavior.dwellTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-5))" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="User Interaction Analysis" />}
      </ChartCard>

      <ChartCard title="User Segments" version="V2">
        {selectedSegment ? (
          <div className="h-full">
            <button
              onClick={() => setSelectedSegment(null)}
              className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Overview
            </button>
            <div className="space-y-4">
              <h3 className="font-medium">{selectedSegment} Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Avg Session Length
                  </div>
                  <div className="text-2xl font-semibold">
                    {
                      analyticsData.userBehavior.userSegments.details[
                        selectedSegment as UserSegmentType
                      ].avgSessionLength
                    }
                    m
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    Actions per Session
                  </div>
                  <div className="text-2xl font-semibold">
                    {
                      analyticsData.userBehavior.userSegments.details[
                        selectedSegment as UserSegmentType
                      ].avgActionsPerSession
                    }
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Retention Rate</div>
                  <div className="text-2xl font-semibold">
                    {
                      analyticsData.userBehavior.userSegments.details[
                        selectedSegment as UserSegmentType
                      ].retentionRate
                    }
                    %
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Common Actions</div>
                <div className="flex gap-2">
                  {analyticsData.userBehavior.userSegments.details[
                    selectedSegment as UserSegmentType
                  ].commonActions.map((action: string) => (
                    <span
                      key={action}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analyticsData.userBehavior.userSegments.overview}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="percentage"
                nameKey="segment"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                onClick={(data) =>
                  setSelectedSegment(data.segment as UserSegmentType)
                }
              >
                {analyticsData.userBehavior.userSegments.overview.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      style={{ cursor: "pointer" }}
                    />
                  )
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
        {!isPro && <PaywallOverlay title="User Segmentation Analysis" />}
      </ChartCard>
    </>
  );
}

export function ChainMetricsCards({ isPro }: MetricsCardsProps) {
  return (
    <>
      <ChartCard title="Chain Usage Distribution" height={400} version="V1">
        <ChartContainer
          config={{
            usage: {
              label: "Usage",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.chainMetrics.usage}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                dataKey="percentage"
                nameKey="chain"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.chainMetrics.usage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>

      {isPro && (
        <ChartCard
          title="RPC Request Success Rate (%)"
          height={400}
          version="V2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.chainMetrics.rpcSuccess}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="chain" />
              <YAxis domain={[95, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" fill="hsl(var(--chart-4))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </>
  );
}

export function TechnicalPerformanceCards({ isPro }: MetricsCardsProps) {
  return (
    <>
      <ChartCard title="Error Distribution Analysis" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={analyticsData.technicalPerformance.errors}
            dataKey="count"
            nameKey="type"
            stroke="#fff"
            fill="hsl(var(--chart-1))"
          >
            {analyticsData.technicalPerformance.errors.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`hsl(var(--chart-${(index % 5) + 1}))`}
              >
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize={12}
                  style={{ pointerEvents: "none" }}
                >
                  {entry.type}
                </text>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize={11}
                  style={{ pointerEvents: "none" }}
                >
                  {entry.count}
                </text>
              </Cell>
            ))}
          </Treemap>
        </ResponsiveContainer>
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length > 0) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-2 shadow rounded border">
                  <div className="font-medium">{data.type}</div>
                  <div className="text-sm text-gray-600">
                    {data.description}
                  </div>
                  <div className="text-sm mt-1">Count: {data.count}</div>
                </div>
              );
            }
            return null;
          }}
        />
        {!isPro && <PaywallOverlay title="Error Distribution Analysis" />}
      </ChartCard>

      <ChartCard title="Method Popularity" version="V1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData.technicalPerformance.methodPopularity}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="method" width={140} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-3))" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Contract Method Analysis" />}
      </ChartCard>

      <ChartCard title="Wallet Compatibility Matrix" height={400} version="V2">
        <div className="h-full w-full overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b border-r bg-gray-50">Wallet</th>
                <th className="p-2 border-b border-r bg-gray-50">Ethereum</th>
                <th className="p-2 border-b border-r bg-gray-50">Polygon</th>
                <th className="p-2 border-b border-r bg-gray-50">Solana</th>
                <th className="p-2 border-b bg-gray-50">Avalanche</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.technicalPerformance.walletCompatibility.map(
                (row) => (
                  <tr key={row.wallet}>
                    <td className="p-2 border-b border-r font-medium">
                      {row.wallet}
                    </td>
                    <td
                      className={`p-2 border-b border-r text-center ${getCompatibilityColor(
                        row.ethereum
                      )}`}
                    >
                      {row.ethereum > 0 ? `${row.ethereum}%` : "—"}
                    </td>
                    <td
                      className={`p-2 border-b border-r text-center ${getCompatibilityColor(
                        row.polygon
                      )}`}
                    >
                      {row.polygon > 0 ? `${row.polygon}%` : "—"}
                    </td>
                    <td
                      className={`p-2 border-b border-r text-center ${getCompatibilityColor(
                        row.solana
                      )}`}
                    >
                      {row.solana > 0 ? `${row.solana}%` : "—"}
                    </td>
                    <td
                      className={`p-2 border-b text-center ${getCompatibilityColor(
                        row.avalanche
                      )}`}
                    >
                      {row.avalanche > 0 ? `${row.avalanche}%` : "—"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {!isPro && <PaywallOverlay title="Wallet Compatibility Analysis" />}
      </ChartCard>
    </>
  );
}

export function AdvancedAnalyticsCards({ isPro }: MetricsCardsProps) {
  return (
    <>
      <ChartCard title="Transaction Value Distribution" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData.advancedAnalytics.transactionValues}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Transaction Value Analysis" />}
      </ChartCard>

      <ChartCard title="Gas Cost Impact Analysis" version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="gasPrice" name="Gas Price (Gwei)" />
            <YAxis
              type="number"
              dataKey="abandonRate"
              name="Abandon Rate (%)"
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter
              name="Gas Impact"
              data={analyticsData.advancedAnalytics.gasImpact}
              fill="hsl(var(--chart-1))"
            />
          </ScatterChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Gas Price Impact Analysis" />}
      </ChartCard>

      <ChartCard title="Cohort Retention Analysis" height={300} version="V2">
        <div className="h-full w-full overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b border-r bg-gray-50">Cohort</th>
                <th className="p-2 border-b border-r bg-gray-50">Week 1</th>
                <th className="p-2 border-b border-r bg-gray-50">Week 2</th>
                <th className="p-2 border-b border-r bg-gray-50">Week 3</th>
                <th className="p-2 border-b bg-gray-50">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.advancedAnalytics.cohortRetention?.map((row) => (
                <tr key={row.cohort}>
                  <td className="p-2 border-b border-r font-medium">
                    {row.cohort}
                  </td>
                  <td
                    className={`p-2 border-b border-r text-center ${getRetentionColor(
                      row.week1
                    )}`}
                  >
                    {row.week1}%
                  </td>
                  <td
                    className={`p-2 border-b border-r text-center ${getRetentionColor(
                      row.week2
                    )}`}
                  >
                    {row.week2}%
                  </td>
                  <td
                    className={`p-2 border-b border-r text-center ${getRetentionColor(
                      row.week3
                    )}`}
                  >
                    {row.week3}%
                  </td>
                  <td
                    className={`p-2 border-b text-center ${getRetentionColor(
                      row.week4
                    )}`}
                  >
                    {row.week4}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isPro && <PaywallOverlay title="Cohort Retention Analysis" />}
      </ChartCard>

      <ChartCard title="Predictive Usage Forecasting" height={280} version="V2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={analyticsData.advancedAnalytics.usageForecasting}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--chart-1))"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="hsl(var(--chart-3))"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Usage Forecasting" />}
      </ChartCard>
    </>
  );
}

function getRetentionColor(value: number): string {
  if (value >= 80) return "text-green-600 bg-green-50";
  if (value >= 60) return "text-blue-600 bg-blue-50";
  if (value >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function getCompatibilityColor(value: number): string {
  if (value === 0) return "text-gray-400";
  if (value >= 98) return "text-green-600 bg-green-50";
  if (value >= 95) return "text-blue-600 bg-blue-50";
  return "text-yellow-600 bg-yellow-50";
}

export function SwapMetricsCards({
  isPro,
  dateFilter,
  customDateRange,
  swapsEnabled,
  setSwapsEnabled,
}: SwapMetricsCardsProps) {
  if (!swapsEnabled) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg p-6 text-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">Swaps Not Enabled</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enable swaps in your project settings to view swap analytics.
          </p>
          <button
            onClick={() => {
              analyticsData.swapMetrics.isEnabled = true;
              setSwapsEnabled(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Enable Swaps
          </button>
        </div>
      </div>
    );
  }

  const filteredData = filterDataByDate(
    analyticsData.swapMetrics.daily,
    dateFilter,
    customDateRange
  );

  return (
    <>
      <ChartCard title="Total Swaps" version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              name="Total Swaps"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Total Swaps Volume (USD)" version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.3}
              name="Volume"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Trading Pairs" version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData.swapMetrics.tradingPairs}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="pair" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--chart-4))" name="Count" />
          </BarChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Trading Pairs Analysis" />}
      </ChartCard>

      <ChartCard title="Swaps by Geography" version="V3">
        <ChartContainer
          config={{
            distribution: {
              label: "Distribution",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <Pie
                data={analyticsData.swapMetrics.geography}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="hsl(var(--chart-1))"
                dataKey="percentage"
                nameKey="region"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {analyticsData.swapMetrics.geography.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        {!isPro && <PaywallOverlay title="Geographic Distribution Analysis" />}
      </ChartCard>

      <ChartCard title="Session to Swaps Ratio" version="V3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData.swapMetrics.sessionsToSwaps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ratio"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        {!isPro && <PaywallOverlay title="Session to Swaps Analysis" />}
      </ChartCard>
    </>
  );
}
