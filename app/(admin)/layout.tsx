import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { MobileNavWrapper } from "@/components/MobileNavWrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="h-[100dvh] bg-[#f8fafc] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-shrink-0 flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 h-full">
        <AdminSidebar />
      </aside>

      {/* Mobile Header & Nav */}
      <MobileNavWrapper>
        <AdminSidebar />
      </MobileNavWrapper>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none -z-10"></div>
        <div className="flex-1 overflow-auto p-4 md:p-10 z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
