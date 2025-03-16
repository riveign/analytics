"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockUsers } from "@/lib/users-data";

interface PaywallButtonProps {
  isPro: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function PaywallButton({ isPro, onClick, children }: PaywallButtonProps) {
  if (isPro) {
    return (
      <button
        onClick={onClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        {children}
      </button>
    );
  }

  return (
    <div className="relative inline-block group">
      <button
        className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
        disabled
      >
        {children}
      </button>
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Upgrade to Pro to access this feature
      </div>
    </div>
  );
}

interface UsersTableProps {
  isPro: boolean;
  dateFilter: "all" | "30" | "60" | "90" | "custom";
  customDateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  showCustomDateFilter: boolean;
  setShowCustomDateFilter: (show: boolean) => void;
  setDateFilter: (filter: "all" | "30" | "60" | "90" | "custom") => void;
  setCustomDateRange: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}

export function UsersTable({
  isPro,
  dateFilter,
  customDateRange,
  showCustomDateFilter,
  setShowCustomDateFilter,
  setDateFilter,
  setCustomDateRange,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  // Filter users based on date
  const filterUsersByDate = (users: typeof mockUsers) => {
    if (dateFilter === "all") return users;

    const now = new Date();

    if (dateFilter === "custom" && isPro) {
      if (!customDateRange.startDate || !customDateRange.endDate) return users;
      return users.filter(
        (user) =>
          new Date(user.lastConnected) >= customDateRange.startDate! &&
          new Date(user.lastConnected) <= customDateRange.endDate!
      );
    }

    const filterDate = new Date(
      now.setDate(now.getDate() - parseInt(dateFilter))
    );
    return users.filter((user) => new Date(user.lastConnected) >= filterDate);
  };

  const filteredUsers = filterUsersByDate(mockUsers);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case "metamask":
      case "coinbase":
      case "trustwallet":
      case "phantom":
        return "bg-blue-100 text-blue-800";
      case "google":
      case "facebook":
      case "x":
        return "bg-green-100 text-green-800";
      case "email":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatIdentifier = (identifier: string, type: string) => {
    if (["metamask", "coinbase", "trustwallet", "phantom"].includes(type)) {
      return `${identifier.slice(0, 6)}...${identifier.slice(-4)}`;
    }
    return identifier;
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case "metamask":
        return "🦊";
      case "coinbase":
        return "🔵";
      case "trustwallet":
        return "🛡️";
      case "phantom":
        return "👻";
      case "google":
        return "G";
      case "facebook":
        return "f";
      case "x":
        return "𝕏";
      case "email":
        return "✉️";
      default:
        return "";
    }
  };

  const handleExport = () => {
    const csvData = filteredUsers.map((user) => ({
      Name: user.name,
      Identifier: user.identifier,
      "Connection Type": user.connectionType,
      "First Connected": formatDate(user.firstConnected),
      "Last Connected": formatDate(user.lastConnected),
      Status: user.status,
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers
          .map((header) => JSON.stringify(row[header as keyof typeof row]))
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-gray-500">
            Total Users: {filteredUsers.length}
          </h3>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <div className="flex gap-2">
            <button
              onClick={() => setDateFilter("all")}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setDateFilter("30")}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "30"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDateFilter("60")}
              className={`px-3 py-1 rounded-md text-sm ${
                dateFilter === "60"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              60 Days
            </button>
            <button
              onClick={() => setDateFilter("90")}
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
        <PaywallButton isPro={isPro} onClick={handleExport}>
          Export Users
        </PaywallButton>
      </div>

      {isPro && showCustomDateFilter && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) =>
                  setCustomDateRange({
                    ...customDateRange,
                    startDate: e.target.value ? new Date(e.target.value) : null,
                  })
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
                  setCustomDateRange({
                    ...customDateRange,
                    endDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => setDateFilter("custom")}
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Identifier</TableHead>
            <TableHead>Connection Type</TableHead>
            <TableHead>First Connected</TableHead>
            <TableHead>Last Connected</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell
                className={
                  ["metamask", "coinbase", "trustwallet", "phantom"].includes(
                    user.connectionType
                  )
                    ? "font-mono"
                    : ""
                }
              >
                {formatIdentifier(user.identifier, user.connectionType)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getConnectionColor(user.connectionType)}
                >
                  <span className="mr-1">
                    {getConnectionIcon(user.connectionType)}
                  </span>
                  {user.connectionType.charAt(0).toUpperCase() +
                    user.connectionType.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.firstConnected)}</TableCell>
              <TableCell>{formatDate(user.lastConnected)}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstUser + 1} to{" "}
          {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
