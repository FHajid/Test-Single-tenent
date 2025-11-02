import Link from "next/link";
import { CATALOG_TAG } from "@/lib/constants";
import Image from "next/image";

export const revalidate = 0;

async function getProducts() {
  try {
    // Use relative URL - works in both environments
    const res = await fetch('/api/products', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


export default async function ProductsPage() {
  const products: Array<{
    id: number;
    slug: string;
    name: string;
    price: number;
    qty?: number;
    images?: string[];
  }> = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    next: { tags: [CATALOG_TAG] },
  }).then((r) => r.json());


  return (
    <main className="mx-auto max-w-6xl px-6 py-10 " >
      {/* Header / hero ringkas */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        </div>
        <Link
          href="/"
          className="rounded-md bg-black px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
        >
          ← Kembali
        </Link>
      </div>

      {/* Empty state */}
      {(!products || products.length === 0) && (
        <div className="grid place-items-center rounded-xl border border-dashed p-10 text-center">
          <div className="text-xl font-semibold">Belum ada produk</div>
          <p className="mt-1 text-sm text-zinc-500">
            Tambahkan data di Supabase, lalu refresh halaman ini.
          </p>
        </div>
      )}

      {/* Grid produk */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const inStock = (p.qty ?? 0) > 0;
          const imgSrc =
            (p.images && p.images.length > 0 && p.images[0]) ||
            "/placeholder.jpg"; // ganti sesuai file di /public

          return (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Gambar */}
              <div className="relative h-48 w-full overflow-hidden border-b">
                <Image
                  src={imgSrc}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                {/* Badge stok */}
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium ${
                    inStock
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {inStock ? `Tersedia (${p.qty})` : "Stok Habis"}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <h2 className="line-clamp-1 text-lg font-semibold text-zinc-900">
                  {p.name}
                </h2>
                <div className="mt-1 text-sm text-zinc-500 line-clamp-1">
                  #{p.slug}
                </div>

                <div className="mt-3 text-[15px] font-semibold text-zinc-900">
                  Rp {Number(p.price).toLocaleString("id-ID")}
                </div>

                <div className="mt-4 text-sm text-blue-600 group-hover:text-blue-800">
                  Lihat Detail →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Demo E-Commerce • Next.js App Router • Supabase • Tailwind
        </footer>
    </main>

  );
}
