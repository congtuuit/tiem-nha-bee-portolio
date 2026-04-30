import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Package, LogOut, LayoutDashboard, Settings, Store } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans overflow-hidden">
      {user && (
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 md:h-full">
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-amber-500/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Nhà Bee</span>
          </div>
          <nav className="p-4 space-y-2 flex-grow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-4">Menu Quản Trị</div>
            <Link 
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl font-medium transition-all group"
            >
              <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Sản phẩm</span>
            </Link>
            <Link 
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-medium transition-all group opacity-50 cursor-not-allowed"
              title="Sắp ra mắt"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Thống kê</span>
            </Link>
            <Link 
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-medium transition-all group opacity-50 cursor-not-allowed"
              title="Sắp ra mắt"
            >
              <Settings className="w-5 h-5" />
              <span>Cài đặt</span>
            </Link>
          </nav>
          
          <div className="p-4 border-t border-slate-100">
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
                <button className="w-full py-2 flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium">
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </aside>
      )}
      
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none -z-10"></div>
        <div className="flex-1 overflow-auto p-6 md:p-10 z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
