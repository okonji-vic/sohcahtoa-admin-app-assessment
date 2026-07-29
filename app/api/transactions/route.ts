import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { TransactionQuery, TransactionStatus } from "@/interfaces/transactions";
import { getTransactions } from "@/lib/mock-transactions";


export const runtime = "nodejs";
// Always fresh — this is live monitoring data, not something to cache.
// See README "Caching strategy" for why this differs from static routes.
export const dynamic = "force-dynamic";

const VALID_STATUSES: TransactionStatus[] = ["pending", "completed", "failed", "flagged"];
const VALID_SORT_FIELDS = ["createdAt", "amount", "status", "reference"] as const;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(sp.get("pageSize") ?? 10) || 10));

  const status = sp.get("status");
  if (status && !VALID_STATUSES.includes(status as TransactionStatus)) {
    return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 422 });
  }

  const sortField = sp.get("sortField");
  if (sortField && !VALID_SORT_FIELDS.includes(sortField as (typeof VALID_SORT_FIELDS)[number])) {
    return NextResponse.json({ error: `Invalid sortField: ${sortField}` }, { status: 422 });
  }

  const sortOrder = sp.get("sortOrder");
  if (sortOrder && !["ascend", "descend"].includes(sortOrder)) {
    return NextResponse.json({ error: `Invalid sortOrder: ${sortOrder}` }, { status: 422 });
  }

  const query: TransactionQuery = {
    page,
    pageSize,
    status: (status as TransactionStatus) ?? undefined,
    sortField: (sortField as TransactionQuery["sortField"]) ?? undefined,
    sortOrder: (sortOrder as TransactionQuery["sortOrder"]) ?? undefined,
    dateFrom: sp.get("dateFrom") ?? undefined,
    dateTo: sp.get("dateTo") ?? undefined,
  };

  try {
    const result = await getTransactions(query);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to load transactions" }, { status: 500 });
  }
}