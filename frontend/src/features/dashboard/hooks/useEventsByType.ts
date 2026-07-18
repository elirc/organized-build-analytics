import { useQuery } from "@tanstack/react-query";

import { getEventsByType } from "../../../api/dashboard.api";

export function useEventsByType(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["dashboard", "events-by-type", startDate, endDate],
    queryFn: () => getEventsByType({ startDate, endDate })
  });
}
