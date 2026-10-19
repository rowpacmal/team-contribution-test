import { useBalance } from "../hooks/useBalance";
import { formatBalance } from "../utils/format-balance";

interface BalanceCardProps {
  fetchBalance: () => Promise<number>;
}

export function BalanceCard({ fetchBalance }: BalanceCardProps) {
  const balance = useBalance(fetchBalance);

  return (
    <section>
      <h2>Balance</h2>
      <p>{balance === null ? "Loading…" : formatBalance(balance)}</p>
    </section>
  );
}
