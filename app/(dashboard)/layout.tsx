import { Suspense } from "react";
import { redirect } from "next/navigation";

import SideNavigation from "@/components/Dashboard/SideNavigation";
import { getSession } from "@/lib/auth";
import SohCahToaPageLoader from "@/components/loader/PageLoader";
import TopNavigation from "@/components/Dashboard/TopNavigation";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) redirect("/login");

  const role = session.role;

  return (
    <Suspense fallback={<SohCahToaPageLoader />}>
      <TopNavigation currentRole={role}  />
      <SideNavigation currentRole={role} />
      <section className="pt-[104px] md:pt-[104px] lg:pt-[104px] xl:pt-[104px] ml-0 xl:ml-[260px] bg-[#F9F9F9] p-4 md:p-6 md:pb-8 min-h-screen h-auto">
        {children}
      </section>
    </Suspense>
  );
}
