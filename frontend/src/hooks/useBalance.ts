import { useEffect, useState } from "react";

/** Loads the balance once, and again whenever `fetchBalance` changes. */
export function useBalance(fetchBalance: () => Promise<number>): number | null {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchBalance().then((value) => {
      if (!cancelled) setBalance(value);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchBalance]);

  return balance;
}
