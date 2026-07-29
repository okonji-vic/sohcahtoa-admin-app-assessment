import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import TransactionsExplorer from "@/components/transactions/transactionsExplorer";
import { DEFAULT_TRANSACTION_QUERY, getTransactions } from "@/lib/mock-transactions";


export const dynamic = "force-dynamic"; // live data, see README caching note

export default async function TransactionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Direct call, not a self-fetch over HTTP: same getTransactions() the
  // Route Handler calls, so there's one implementation of the query logic,
  // and no redundant network hop for the very first render.
  const initialData = await getTransactions(DEFAULT_TRANSACTION_QUERY);

  return (
    <div className="p-2">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Transactions</h1>
      <TransactionsExplorer initialData={initialData} session={session} />
    </div>
  );
}