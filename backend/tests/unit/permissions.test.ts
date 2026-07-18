import { hasPermission } from "../../src/shared/permissions.js";

describe("permission matrix", () => {
  it("allows audit viewers to read audit dashboards", () => {
    expect(hasPermission("AUDIT_VIEWER", "audit:view")).toBe(true);
  });

  it("blocks read-only users from exporting", () => {
    expect(hasPermission("READ_ONLY", "exports:create")).toBe(false);
  });
});
