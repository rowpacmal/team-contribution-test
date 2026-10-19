/** Talks to the Minima node. */
export interface NodeClient {
  getBalance(): Promise<string>;
}

/** Reads the wallet balance from the node and checks it's a valid amount. */
export async function getBalance(client: NodeClient): Promise<number> {
  const raw = await client.getBalance();
  const amount = Number(raw);
  if (raw.trim() === "" || !Number.isFinite(amount) || amount < 0) {
    throw new Error(`Invalid balance from node: "${raw}"`);
  }
  return amount;
}

export function untested(a: number): number {
  if (a > 1) return a * 2;
  return a;
}
