import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Package, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The middleware handles basic protection, but we still need the user info here.
  // If no user but middleware let them through, it might be the login page itself.
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {user && (
        <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex-shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-neutral-200">
            <span className="text-lg font-bold text-neutral-900">Admin Dashboard</span>
          </div>
          <nav className="p-4 space-y-1">
            <Link 
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>Sản phẩm</span>
            </Link>
          </nav>
        </aside>
      )}
      
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {user && (
          <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 flex-shrink-0">
            <div className="text-sm text-neutral-500">
              Xin chào, {user.email}
            </div>
            <form action={async () => {
              "use server";
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect("/admin/login");
            }}>
              <button className="text-sm flex items-center gap-2 text-neutral-600 hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </form>
          </header>
        )}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
