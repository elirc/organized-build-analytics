import { sanitizeCsvCell, toCsv } from "../../src/shared/utils/csv.js";

describe("csv utilities", () => {
  it("prefixes spreadsheet formulas", () => {
    expect(sanitizeCsvCell("=SUM(A1:A2)")).toBe("'=SUM(A1:A2)");
    expect(sanitizeCsvCell("+cmd")).toBe("'+cmd");
  });

  it("builds a csv string from records", () => {
    const csv = toCsv([
      { name: "alpha", value: 1 },
      { name: "=unsafe", value: 2 }
    ]);

    expect(csv).toContain('"alpha"');
    expect(csv).toContain("\"'=unsafe\"");
  });
});
