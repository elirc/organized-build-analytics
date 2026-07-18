import { useQuery } from "@tanstack/react-query";

import { getEventsOverTime } from "../../../api/dashboard.api";

export function useEventsOverTime(startDate: string, endDate: string, interval: string) {
  return useQuery({
    queryKey: ["dashboard", "events-over-time", startDate, endDate, interval],
    queryFn: () => getEventsOverTime({ startDate, endDate, interval })
  });
}
