import { render, screen } from "@testing-library/react";

import { KpiCardGrid } from "../features/dashboard/components/KpiCardGrid";

describe("KpiCardGrid", () => {
  it("renders KPI labels from dashboard data", () => {
    render(
      <KpiCardGrid
        data={{
          totalEvents: 1200,
          activeUsers: 220,
          failedEvents: 18,
          errorRate: 0.015,
          csvExports: 9,
          averageApiLatencyMs: 212
        }}
      />
    );

    expect(screen.getByText("Total events")).toBeInTheDocument();
    expect(screen.getByText("Active users")).toBeInTheDocument();
    expect(screen.getByText("Avg API latency")).toBeInTheDocument();
  });
});
