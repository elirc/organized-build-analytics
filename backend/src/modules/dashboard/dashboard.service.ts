import { parseDateRange } from "../../shared/utils/dates.js";
import { dashboardRepository } from "./dashboard.repository.js";
import { chartDataService } from "./chartData.service.js";
import { kpiService } from "./kpi.service.js";

export const dashboardService = {
  getKpiSummary: kpiService.getSummary,
  getEventsOverTime: chartDataService.getEventsOverTime,
  getEventsByType: chartDataService.getEventsByType,
  getActiveUsers: chartDataService.getActiveUsers,
  getErrorRate: chartDataService.getErrorRate,
  getConversionFunnel: chartDataService.getConversionFunnel,

  async getRecentActivity(input: {
    startDate: string;
    endDate: string;
  }) {
    const range = parseDateRange(input.startDate, input.endDate, { maxRangeDays: 365 });
    return dashboardRepository.getRecentActivity(range.startDate, range.endDate);
  }
};
