import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBalance } from "../../src/hooks/useBalance";

describe("useBalance", () => {
  it("is null while loading, then the balance", async () => {
    const { result } = renderHook(() => useBalance(() => Promise.resolve(42)));
    expect(result.current).toBeNull();
    await waitFor(() => expect(result.current).toBe(42));
  });

  it("ignores a result that arrives after unmount", async () => {
    const { promise, resolve } = Promise.withResolvers<number>();
    const fetchBalance = () => promise;
    const { result, unmount } = renderHook(() => useBalance(fetchBalance));
    unmount();
    resolve(42);
    await Promise.resolve();
    expect(result.current).toBeNull();
  });
});
