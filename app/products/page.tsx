import Link from "next/link";
import { CATALOG_TAG } from "@/lib/constants";

export default async function ProductsPage() {
  const products = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    {
      next: { tags: [CATALOG_TAG] },
    }
  ).then((r) => r.json());

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🛍️ Product Catalog</h1>
          <p className="text-gray-500">Temukan berbagai produk demo di bawah ini.</p>
        </div>
        <Link
          href="/"
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          ← Kembali
        </Link>
      </div>

      {/* Grid produk */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all bg-white"
          >
            {/* Nama produk */}
            <h2 className="text-lg font-semibold mb-1 line-clamp-1">{p.name}</h2>

            {/* Harga */}
            <div className="text-gray-700 font-medium mb-2">
              Rp {p.price.toLocaleString("id-ID")}
            </div>

            {/* Stok */}
            <div
              className={`text-sm font-medium ${
                p.qty > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {p.qty > 0 ? `Tersedia (${p.qty})` : "Stok Habis"}
            </div>

            {/* Tombol lihat detail */}
            <div className="mt-4">
              <span className="inline-block text-sm text-blue-600 hover:text-blue-800">
                Lihat Detail →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer kecil */}
      <div className="mt-12 text-center text-xs text-gray-400">
        Demo E-Commerce • Next.js + Supabase
      </div>
    </main>
  );
}
