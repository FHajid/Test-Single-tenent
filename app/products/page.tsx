import Link from "next/link";
import { CATALOG_TAG } from "@/lib/constants";

export default async function ProductsPage() {
  const products: Array<{
    id: number;
    slug: string;
    name: string;
    price: number;
    qty?: number;
  }> = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    next: { tags: [CATALOG_TAG] },
  }).then((r) => r.json());

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🛍️ Product Catalog</h1>
          <p className="text-gray-500">Temukan berbagai produk demo di bawah ini.</p>
        </div>
        <Link
          href="/"
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-md transition hover:bg-gray-700"
        >
          ← Kembali
        </Link>
      </div>

      {/* Grid produk */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="border border-gray-200 rounded-xl bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-1 line-clamp-1 text-lg font-semibold">{p.name}</h2>
            <div className="mb-2 font-medium text-gray-700">
              Rp {p.price.toLocaleString("id-ID")}
            </div>
            <div
              className={`text-sm font-medium ${
                (p.qty ?? 0) > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {(p.qty ?? 0) > 0 ? `Tersedia (${p.qty})` : "Stok Habis"}
            </div>
            <div className="mt-4">
              <span className="inline-block text-sm text-blue-600 hover:text-blue-800">
                Lihat Detail →
              </span>
            </div>
          </Link>
        ))}
        {/* ❌ REMOVE this: <ProductsPage/> */}
      </div>

      {/* Footer kecil */}
      <div className="mt-12 text-center text-xs text-gray-400">
        Demo E-Commerce • Next.js + Supabase
      </div>
    </main>
  );
}
