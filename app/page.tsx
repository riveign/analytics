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
      </Tabs>
    </div>
  );
}
