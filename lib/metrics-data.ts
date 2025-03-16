export const metricsDefinitions = {
  sessionMetrics: [
    {
      name: "Daily Sessions",
      explanation: "Count of daily WalletConnect sessions",
      visualization: "Line chart with time series",
      tier: "Free",
    },
    {
      name: "Connection Channel Distribution",
      explanation: "Breakdown of connection types (Wallet, Social, Email)",
      visualization: "Pie chart",
      tier: "Pro",
    },
    {
      name: "Social Connection Types",
      explanation:
        "Distribution of social login providers (Google, Facebook, X)",
      visualization: "Donut chart",
      tier: "Pro",
    },
    {
      name: "Connection Success Rate by Channel",
      explanation:
        "Success rate for each connection method (Wallet, Social, Email)",
      visualization: "Bar chart",
      tier: "Pro",
    },
    {
      name: "Connection Method Distribution",
      explanation: "Breakdown of connection types (QR, mobile, extension)",
      visualization: "Pie chart",
      tier: "Free",
    },
    {
      name: "Connection Success Rate",
      explanation: "Percentage of successful connections by method",
      visualization: "Bar chart",
      tier: "Free",
    },
    {
      name: "Time to Connect",
      explanation: "Average seconds to complete connection",
      visualization: "Bar chart",
      tier: "Free",
    },
    {
      name: "Connection Drop-off Points",
      explanation: "Where users abandon the connection flow",
      visualization: "Funnel chart",
      tier: "Pro",
    },
  ],
  userBehavior: [
    {
      name: "Feature Usage",
      explanation: "Count of different actions (sign, send, etc.)",
      visualization: "Horizontal bar chart",
      tier: "Pro",
    },
    {
      name: "Time Spent",
      explanation: "Average minutes users spend per session",
      visualization: "Area chart",
      tier: "Pro",
    },
    {
      name: "Sessions-to-Transactions Ratio",
      explanation: "Conversion rate from connections to activity",
      visualization: "Line chart with ratio trend",
      tier: "Pro",
    },
    {
      name: "Return Rate Analysis",
      explanation: "Users who reconnect within 24h, 7d, 30d",
      visualization: "Multi-series bar chart",
      tier: "Pro",
    },
    {
      name: "Dwell Time Between Actions",
      explanation: "Time between connection and first transaction",
      visualization: "Histogram",
      tier: "Pro",
    },
    {
      name: "User Segments",
      explanation: "Analysis of user types based on behavior patterns",
      visualization: "Donut chart with drill-down",
      tier: "Pro",
    },
  ],
  chainMetrics: [
    {
      name: "Chain Usage Distribution",
      explanation: "Percentage breakdown of chain activity",
      visualization: "Pie chart",
      tier: "Free",
    },
    {
      name: "Multi-Chain User Patterns",
      explanation: "Flow of users between different chains",
      visualization: "Sankey diagram",
      tier: "Pro",
    },
    {
      name: "RPC Request Success Rate",
      explanation: "Reliability of node connections by chain",
      visualization: "Heatmap",
      tier: "Pro",
    },
  ],
  technicalPerformance: [
    {
      name: "Error Distribution Analysis",
      explanation: "Types and frequency of errors",
      visualization: "Treemap",
      tier: "Pro",
    },
    {
      name: "Method Popularity",
      explanation: "Most frequently called smart contract methods",
      visualization: "Horizontal bar chart",
      tier: "Pro",
    },
    {
      name: "Wallet Compatibility Matrix",
      explanation: "Success rates by wallet/chain combinations",
      visualization: "Grid heatmap",
      tier: "Pro",
    },
  ],
  advancedAnalytics: [
    {
      name: "Transaction Value Distribution",
      explanation: "Range of transaction values with percentiles",
      visualization: "Box and whisker plot",
      tier: "Pro",
    },
    {
      name: "Gas Cost Impact Analysis",
      explanation: "Correlation: abandonment vs. gas prices",
      visualization: "Scatter plot with trend line",
      tier: "Pro",
    },
    {
      name: "Cohort Retention Analysis",
      explanation: "User retention over time by cohort",
      visualization: "Retention grid",
      tier: "Pro",
    },
    {
      name: "Predictive Usage Forecasting",
      explanation: "Projected platform usage",
      visualization: "Line chart with forecast zone",
      tier: "Pro",
    },
    {
      name: "Developer Intent Analysis",
      explanation: "Unusual patterns indicating implementation issues",
      visualization: "Anomaly detection chart",
      tier: "Pro",
    },
  ],
  swapMetrics: [
    {
      name: "Total Swaps",
      explanation: "Total number of swaps performed through WalletConnect",
      visualization: "Line chart with time series",
      tier: "Free",
    },
    {
      name: "Total Swaps Volume",
      explanation: "Total volume of swaps in USD",
      visualization: "Area chart",
      tier: "Free",
    },
    {
      name: "Trading Pairs",
      explanation: "Most popular token pairs for swaps",
      visualization: "Bar chart",
      tier: "Pro",
    },
    {
      name: "Swaps by Geography",
      explanation: "Distribution of swaps by geographic region",
      visualization: "World map heatmap",
      tier: "Pro",
    },
    {
      name: "Session to Swaps Ratio",
      explanation: "Conversion rate from sessions to completed swaps",
      visualization: "Line chart with ratio trend",
      tier: "Pro",
    },
  ],
};
