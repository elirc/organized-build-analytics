import { toCsv } from "../../shared/utils/csv.js";

export const csvService = {
  buildDownloadableCsv(rows: Record<string, unknown>[]) {
    return toCsv(rows);
  },

  buildFileName(prefix: string) {
    return `${prefix}-${new Date().toISOString().replaceAll(":", "-")}.csv`;
  }
};
