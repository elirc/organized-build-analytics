import { useQuery } from "@tanstack/react-query";

import { getEvents } from "../../../api/events.api";

export function useEvents(startDate: string, endDate: string, eventType?: string) {
  return useQuery({
    queryKey: ["events", startDate, endDate, eventType],
    queryFn: () => getEvents({ startDate, endDate, eventType })
  });
}
