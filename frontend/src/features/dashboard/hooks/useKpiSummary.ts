import { useQuery } from "@tanstack/react-query";

import { getKpiSummary } from "../../../api/dashboard.api";

export function useKpiSummary(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["dashboard", "kpi-summary", startDate, endDate],
    queryFn: () => getKpiSummary({ startDate, endDate })
  });
}
