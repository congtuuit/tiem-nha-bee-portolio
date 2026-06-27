import { Store, LogOut } from "lucide-react";
import { AdminNav } from "./AdminNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import pkg from "../package.json";

export async function AdminSidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-20 flex items-center px-8 border-b border-slate-100 flex-shrink-0">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-amber-500/20">
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">Tiệm Nhà Bee</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <AdminNav />
      </div>

      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-500 font-bold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 truncate w-full">{user.email}</span>
          <span className="text-xs text-slate-500 mb-4">Quản trị viên</span>

          <form action={async () => {
            "use server";
            const supabase = await createClient();
            await supabase.auth.signOut();
            redirect("/admin/login");
          }} className="w-full">
            <button className="w-full cursor-pointer py-2 flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </form>
        </div>
        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-400 font-medium">Phiên bản {pkg.version}</span>
        </div>
      </div>
    </div>
  );
}
