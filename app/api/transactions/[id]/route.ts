import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTransactionById, flagTransaction, addTransactionNote } from "@/lib/mock-transactions";
import { csrfRejection, hasValidCsrfHeader } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PatchBody {
  action?: "flag" | "unflag" | "note";
  note?: string;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!hasValidCsrfHeader(req)) return csrfRejection();
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!getTransactionById(id)) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  let body: PatchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.action === "flag" || body.action === "unflag") {
    // The actual enforcement boundary for "only admin can flag" — the UI
    // hides the button for non-admins as a courtesy, but this check is what
    // actually matters. Never trust a client-side role check alone.
    if (session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: admin role required" }, { status: 403 });
    }
    return NextResponse.json({ transaction: flagTransaction(id, body.action === "flag") });
  }

  if (body.action === "note") {
    if (typeof body.note !== "string" || !body.note.trim()) {
      return NextResponse.json({ error: "Note text is required" }, { status: 422 });
    }
    // Either role may add a note. Only flag/unflag is admin-gated per the brief.
    return NextResponse.json({ transaction: addTransactionNote(id, body.note.trim()) });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 422 });
}