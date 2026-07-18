import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const MAX_RAW_QUERY_RANGE_DAYS = 180;

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function parseDateRange(
  startDate: string,
  endDate: string,
  options?: { maxRangeDays?: number }
): DateRange {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError(ERROR_CODES.BAD_REQUEST, "Invalid date range provided", 400);
  }

  if (start > end) {
    throw new AppError(ERROR_CODES.BAD_REQUEST, "startDate must be before endDate", 400);
  }

  const maxRangeDays = options?.maxRangeDays ?? MAX_RAW_QUERY_RANGE_DAYS;
  const rangeMs = end.getTime() - start.getTime();
  const rangeDays = rangeMs / (1000 * 60 * 60 * 24);

  if (rangeDays > maxRangeDays) {
    throw new AppError(
      ERROR_CODES.BAD_REQUEST,
      `Date range exceeds the ${maxRangeDays} day limit`,
      400
    );
  }

  return { startDate: start, endDate: end };
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
