// app/products/[slug]/page.tsx
import Link from "next/link";
import ProductTabs from "@/components/ProductTabs";
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
};

export default async function ProductDetail({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const { slug } = await Promise.resolve(params);

  const sb = supabaseAnon();
  const { data: product, error: e1 } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single<ProductRow>();

  if (e1 || !product) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">Produk tidak ditemukan.</p>
        <Link href="/products" className="text-blue-600 underline">← Kembali ke katalog</Link>
      </main>
    );
  }

  const { data: st } = await sb
    .from("stock")
    .select("qty")
    .eq("product_id", product.id)
    .single<{ qty: number | string | null }>();

  const price = typeof product.price === "number" ? product.price : Number(product.price ?? 0);
  const qty = typeof st?.qty === "number" ? st.qty : Number(st?.qty ?? 0);

  // ✅ Server Action — call Supabase directly (no /api/checkout)
  async function checkoutAction(formData: FormData) {
    "use server";
    const pid = Number(formData.get("productId"));
    if (!Number.isFinite(pid)) return;

    const svc = supabaseService();
    const { data, error } = await svc.rpc("checkout_atomic", { p_product_id: pid });

    // Invalidate caches so catalog & page update
    revalidateTag(CATALOG_TAG);
    revalidatePath("/products", "page");
    revalidatePath(`/products/${slug}`, "page");

    if (error) throw new Error(`Checkout failed: ${error.message}`);
    // if data !== true → out of stock; you could surface a message via redirect/searchParams if needed
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Link href="/products" className="text-sm text-blue-600">← Kembali</Link>

      <h1 className="mt-2 text-2xl font-semibold">{product.name}</h1>
      <div className="mb-2 opacity-70">Rp {price.toLocaleString("id-ID")}</div>

      <div className={`text-sm ${qty > 0 ? "text-green-700" : "text-red-700"}`}>
        Stock: {qty}
      </div>

      <ProductTabs
        description={product.description ?? ""}
        specs={product.specs ?? ""}
        reviews={[]}
      />

      {/* Submit to the server action (no method/action attributes) */}
      <form className="mt-4" action={checkoutAction}>
        <input type="hidden" name="productId" value={product.id} />
        <button
          type="submit"
          className="mt-2 rounded bg-black px-4 py-2 text-white disabled:bg-gray-400"
          disabled={qty <= 0}
        >
          Fake Checkout
        </button>
      </form>
    </main>
  );
}
