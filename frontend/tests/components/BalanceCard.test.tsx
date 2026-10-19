import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BalanceCard } from "../../src/components/BalanceCard";

describe("BalanceCard", () => {
  it("shows loading, then the formatted balance", async () => {
    render(<BalanceCard fetchBalance={() => Promise.resolve(10)} />);
    expect(screen.getByText("Loading…")).toBeTruthy();
    expect(await screen.findByText("10.00 MINIMA")).toBeTruthy();
    expect(screen.queryByText("Your wallet is empty.")).toBeNull();
  });

  it("shows a message when the wallet is empty", async () => {
    render(<BalanceCard fetchBalance={() => Promise.resolve(0)} />);
    expect(await screen.findByText("Your wallet is empty.")).toBeTruthy();
  });
});
