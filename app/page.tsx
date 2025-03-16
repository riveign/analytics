"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard-header";
import { UpgradeBanner } from "@/components/upgrade-banner";
import { MetricsTable } from "@/components/metrics-table";
import { UsersTable } from "@/components/users-table";
import {
  SessionMetricsCards,
  UserBehaviorCards,
  ChainMetricsCards,
  TechnicalPerformanceCards,
  AdvancedAnalyticsCards,
  SwapMetricsCards,
} from "@/components/chart-cards";
import { analyticsData } from "@/lib/data";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "@/components/ui/pie-chart";
import { Ribbon } from "@/components/ui/ribbon";

type DateFilter = "all" | "30" | "60" | "90" | "custom";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

function DateFilters({
  dateFilter,
  setDateFilter,
  isPro,
  showCustomDateFilter,
  setShowCustomDateFilter,
  customDateRange,
  setCustomDateRange,
}: {
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  isPro: boolean;
  showCustomDateFilter: boolean;
  setShowCustomDateFilter: (show: boolean) => void;
  customDateRange: DateRange;
  setCustomDateRange: (
    range: DateRange | ((prev: DateRange) => DateRange)
  ) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDateFilter("all");
              }}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => {
                setDateFilter("30");
              }}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "30"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => {
                setDateFilter("60");
              }}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "60"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              60 Days
            </button>
            <button
              onClick={() => {
                setDateFilter("90");
              }}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "90"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              90 Days
            </button>
          </div>
          <div className="relative inline-block group">
            <button
              onClick={() => isPro && setShowCustomDateFilter(true)}
              className={`px-3 py-1 rounded-md text-sm ${
                isPro
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isPro}
            >
              Custom Range
            </button>
            {!isPro && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Upgrade to Pro to use custom date ranges
              </div>
            )}
          </div>
        </div>
      </div>

      {isPro && showCustomDateFilter && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value ? new Date(e.target.value) : null,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) =>
                  setCustomDateRange((prev) => ({
                    ...prev,
                    endDate: e.target.value ? new Date(e.target.value) : null,
                  }))
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => {
                  setDateFilter("custom");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setShowCustomDateFilter(false);
                  setDateFilter("all");
                  setCustomDateRange({ startDate: null, endDate: null });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompetitionCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 relative">
      <Ribbon version="V3" />
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-lg">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [isPro, setIsPro] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [showCustomDateFilter, setShowCustomDateFilter] = useState(false);
  const [swapsEnabled, setSwapsEnabled] = useState(
    analyticsData.swapMetrics.isEnabled
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <DashboardHeader isPro={isPro} setIsPro={setIsPro} />
      {!isPro && <UpgradeBanner />}

      <Tabs defaultValue="session" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="user">User Behavior</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="swaps">Swaps</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
        </TabsList>

        <TabsContent value="session" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <DateFilters
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              isPro={isPro}
              showCustomDateFilter={showCustomDateFilter}
              setShowCustomDateFilter={setShowCustomDateFilter}
              customDateRange={customDateRange}
              setCustomDateRange={setCustomDateRange}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SessionMetricsCards
                isPro={isPro}
                dateFilter={dateFilter}
                customDateRange={customDateRange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <DateFilters
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              isPro={isPro}
              showCustomDateFilter={showCustomDateFilter}
              setShowCustomDateFilter={setShowCustomDateFilter}
              customDateRange={customDateRange}
              setCustomDateRange={setCustomDateRange}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UserBehaviorCards
                isPro={isPro}
                dateFilter={dateFilter}
                customDateRange={customDateRange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <DateFilters
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              isPro={isPro}
              showCustomDateFilter={showCustomDateFilter}
              setShowCustomDateFilter={setShowCustomDateFilter}
              customDateRange={customDateRange}
              setCustomDateRange={setCustomDateRange}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChainMetricsCards
                isPro={isPro}
                dateFilter={dateFilter}
                customDateRange={customDateRange}
              />
              <TechnicalPerformanceCards
                isPro={isPro}
                dateFilter={dateFilter}
                customDateRange={customDateRange}
              />
              <AdvancedAnalyticsCards
                isPro={isPro}
                dateFilter={dateFilter}
                customDateRange={customDateRange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="swaps" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <DateFilters
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              isPro={isPro}
              showCustomDateFilter={showCustomDateFilter}
              setShowCustomDateFilter={setShowCustomDateFilter}
              customDateRange={customDateRange}
              setCustomDateRange={setCustomDateRange}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SwapMetricsCards
                isPro={isPro}
                dateFilter={dateFilter}
                customDateRange={customDateRange}
                swapsEnabled={swapsEnabled}
                setSwapsEnabled={setSwapsEnabled}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <MetricsTable />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <DateFilters
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              isPro={isPro}
              showCustomDateFilter={showCustomDateFilter}
              setShowCustomDateFilter={setShowCustomDateFilter}
              customDateRange={customDateRange}
              setCustomDateRange={setCustomDateRange}
            />
            <UsersTable
              isPro={isPro}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              customDateRange={customDateRange}
              showCustomDateFilter={showCustomDateFilter}
              setShowCustomDateFilter={setShowCustomDateFilter}
              setCustomDateRange={setCustomDateRange}
            />
          </div>
        </TabsContent>

        <TabsContent value="competition">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {!isPro ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-blue-50 rounded-full p-4 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500"
                  >
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Discover Where Your Users Spend Time
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Get insights into user engagement patterns across different
                  Web3 categories. Understand which apps capture the most user
                  attention and when they're most active.
                </p>
                <button
                  onClick={() => setIsPro(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Overview Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Where Your Users Spend Their Time
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {analyticsData.competitiveMetrics.userTimeSpent.map(
                      (category) => (
                        <div
                          key={category.category}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {category.category}
                            </span>
                            <span
                              className={`text-sm ${
                                category.trend.startsWith("+")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {category.trend}%
                            </span>
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {category.totalShare}%
                          </div>
                          <div className="text-sm text-gray-600">
                            of total time
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Detailed Categories */}
                <div className="space-y-6">
                  {analyticsData.competitiveMetrics.userTimeSpent.map(
                    (category) => (
                      <CompetitionCard
                        key={category.category}
                        title={category.category}
                      >
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            Peak Hours (UTC):
                          </span>
                          {analyticsData.competitiveMetrics.timeSpentTrends.peakHours[
                            category.category.split(
                              "/"
                            )[0] as keyof typeof analyticsData.competitiveMetrics.timeSpentTrends.peakHours
                          ]?.map((hour: string) => (
                            <span
                              key={hour}
                              className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2"
                              title={`${hour} UTC`}
                            >
                              {hour}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                          {/* Pie Chart */}
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={category.apps}
                                  dataKey="timeShare"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  label={({
                                    name,
                                    percent,
                                  }: {
                                    name: string;
                                    percent: number;
                                  }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                  }
                                >
                                  {category.apps.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={`hsl(var(--chart-${
                                        (index % 5) + 1
                                      }))`}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Global Metrics */}
                          <div className="flex flex-col justify-center">
                            <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                              <h4 className="font-medium text-lg mb-4">
                                Category Averages
                              </h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="text-sm text-gray-600 mb-1">
                                    Average Session
                                  </div>
                                  <div className="text-2xl font-semibold">
                                    {(
                                      category.apps.reduce(
                                        (acc, app) => acc + app.avgDuration,
                                        0
                                      ) / category.apps.length
                                    ).toFixed(1)}{" "}
                                    min
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="text-sm text-gray-600 mb-1">
                                    Sessions/Week
                                  </div>
                                  <div className="text-2xl font-semibold">
                                    {(
                                      category.apps.reduce(
                                        (acc, app) => acc + app.sessionsPerWeek,
                                        0
                                      ) / category.apps.length
                                    ).toFixed(1)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CompetitionCard>
                    )
                  )}
                </div>

                {/* Regional User Overlap */}
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Where Your Users Go By Region
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(
                      analyticsData.competitiveMetrics.regionalUserOverlap
                    ).map(([region, apps]) => (
                      <CompetitionCard key={region} title={region}>
                        <div className="space-y-3">
                          {Object.values(apps)[0].map((overlap) => (
                            <div
                              key={overlap.app}
                              className="bg-white rounded-lg p-3 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {overlap.app}
                                </span>
                                <span className="text-sm text-blue-600 font-semibold">
                                  {overlap.overlap}%
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${overlap.overlap}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CompetitionCard>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
