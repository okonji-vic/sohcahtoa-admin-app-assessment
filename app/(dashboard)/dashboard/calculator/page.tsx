import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";



export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: 0 }}>Sohcahtoa Admin App</h1>
      <p style={{ color: "#475569" }}>
        Signed in as <strong>{session.sub}</strong>{" "}
        <span
          style={{
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 999,
            background: session.role === "admin" ? "#fef3c7" : "#e0e7ff",
            color: session.role === "admin" ? "#92400e" : "#3730a3",
          }}
        >
          {session.role}
        </span>
      </p>
      <p style={{ color: "#94a3b8" }}>Placeholder Card Page. contents for cards would be displayed here</p>
    </main>
  );
}