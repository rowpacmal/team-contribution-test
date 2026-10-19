import { describe, expect, it } from "vitest";
import { getBalance } from "../../src/wallet/balance-service";

const client = (raw: string) => ({ getBalance: () => Promise.resolve(raw) });

describe("getBalance", () => {
  it("returns the balance as a number", async () => {
    await expect(getBalance(client("1234.5"))).resolves.toBe(1234.5);
  });

  it.each(["", "abc", "-1", "Infinity"])("rejects %j", async (raw) => {
    await expect(getBalance(client(raw))).rejects.toThrow("Invalid balance");
  });
});
