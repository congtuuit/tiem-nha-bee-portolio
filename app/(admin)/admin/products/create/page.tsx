import { ProductForm } from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Thêm sản phẩm mới</h1>
      </div>
      <ProductForm />
    </div>
  );
}
