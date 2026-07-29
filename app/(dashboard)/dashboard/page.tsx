import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import FXSection from "@/components/Dashboard/FXSection";
import CardSection from "@/components/Dashboard/CardSection";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="p-2">
      <p className="text-gray-600">
        Signed in as <strong>{session.role}</strong>
      </p>
      <div className="min-h-screen bg-white p-2">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* FX Section was changed from 2/3, now 3/5 (60%) */}
          <div className="lg:col-span-3">
            <FXSection />
          </div>

          {/* Card Section was changed from 1/3, now 2/5 (40%) */}
          <div className="lg:col-span-2">
            <CardSection />
          </div>
        </div>
      </div>
    </div>
  );
}