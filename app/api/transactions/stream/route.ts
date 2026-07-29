import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { ensureSimulatorRunning } from "@/lib/simulator";
import { TransactionEvent, transactionEvents } from "@/lib/events";


export const runtime = "nodejs"; // EventEmitter + long-lived streams need Node, not Edge
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  ensureSimulatorRunning();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: TransactionEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      transactionEvents.on("transaction", send);

      // Keep intermediary proxies (nginx, etc.) from killing an idle connection.
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: heartbeat\n\n`));
      }, 15000);

      const close = () => {
        clearInterval(heartbeat);
        transactionEvents.off("transaction", send);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      // Ties stream lifetime to the request — fires on client disconnect,
      // tab close, or the abort controllers used in Section 5.2's logout flow.
      req.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}