import { describe, expect, it } from "vitest";
import { formatBalance } from "../../src/utils/format-balance";

describe("formatBalance", () => {
  it("adds separators, two decimals and the symbol", () => {
    expect(formatBalance(1234.5)).toBe("1,234.50 MINIMA");
  });

  it("uses a custom symbol", () => {
    expect(formatBalance(0, "USDT")).toBe("0.00 USDT");
  });

  it("shows a dash instead of NaN for an invalid amount", () => {
    expect(formatBalance(Number.NaN)).toBe("— MINIMA");
  });
});
