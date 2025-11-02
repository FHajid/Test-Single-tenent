// app/products/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import ProductTabs from "@/components/ProductTabs";
import CheckoutButton from "@/components/CheckoutButton";
import { supabaseAnon, supabaseService } from "@/lib/supabase";
import { revalidateTag, revalidatePath } from "next/cache";
import { CATALOG_TAG } from "@/lib/constants";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  price: number | string | null;
  description?: string | null;
  specs?: string | null;
  images?: string[] | null; // optional kalau kamu sudah punya kolom ini
};

export default async function ProductDetail({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  // Next 15: params bisa Promise → unwrap aman
  const { slug } = await Promise.resolve(params);

  const sb = supabaseAnon();

  // Ambil produk
  const { data: product, error: e1 } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single<ProductRow>();

  if (e1 || !product) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-red-600">Produk tidak ditemukan.</p>
        <Link href="/products" className="text-blue-600 underline">
          ← Kembali ke katalog
        </Link>
      </main>
    );
  }

  // Ambil stok
  const { data: st } = await sb
    .from("stock")
    .select("qty")
    .eq("product_id", product.id)
    .single<{ qty: number | string | null }>();

  // Normalisasi nilai
  const price =
    typeof product.price === "number" ? product.price : Number(product.price ?? 0);
  const qty = typeof st?.qty === "number" ? st.qty : Number(st?.qty ?? 0);

  // Server Action — panggil Supabase langsung (tanpa /api/checkout)
  async function checkoutAction(formData: FormData) {
    "use server";
    const pid = Number(formData.get("productId"));
    if (!Number.isFinite(pid)) return;

    const svc = supabaseService();
    const { data, error } = await svc.rpc("checkout_atomic", { p_product_id: pid });

    // Invalidate caches supaya katalog & halaman ini update
    revalidateTag(CATALOG_TAG, "");             // tag name and profile string
    revalidatePath("/products", "page");
    revalidatePath(`/products/${slug}`, "page");

    if (error) throw new Error(`Checkout failed: ${error.message}`);
    // jika data !== true → stok habis; kamu bisa tampilkan notifikasi via redirect/searchParams kalau perlu
  }

  // Gambar utama (fallback ke placeholder)
  const imgSrc =
    (product.images && product.images[0]) || "/placeholder-product.jpg";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Breadcrumb / Back */}
      <div className="mb-4 text-sm">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Kembali ke katalog
        </Link>
      </div>

      {/* Header produk */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
        <div className="mt-1 text-zinc-600">
          Slug: <span className="font-mono text-zinc-700">{product.slug}</span>
        </div>
      </div>

      {/* Konten dua kolom */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Kolom kiri: gambar */}
        <div>
          <div className="relative h-72 w-full overflow-hidden rounded-xl border">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
            {/* Badge stok di atas gambar */}
            <span
              className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-medium ${
                qty > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {qty > 0 ? `Tersedia (${qty})` : "Stok Habis"}
            </span>
          </div>
        </div>

        {/* Kolom kanan: info & checkout */}
        <div>
          <div className="text-2xl font-semibold">
            Rp {price.toLocaleString("id-ID")}
          </div>

          <div className="mt-2 text-sm text-zinc-600">
            {qty > 0 ? "Siap dikirim hari ini." : "Silakan pilih produk lain."}
          </div>

          {/* Tabs deskripsi/specs/reviews */}
          <ProductTabs
            description={product.description ?? ""}
            specs={product.specs ?? ""}
            reviews={[]}
          />

          {/* Form checkout (Server Action) */}
          <form className="mt-5" action={checkoutAction}>
            <input type="hidden" name="productId" value={product.id} />
            <CheckoutButton />
          </form>
        </div>
      </div>
    </main>
  );
}
