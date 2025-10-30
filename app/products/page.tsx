import { CATALOG_TAG } from '@/lib/constants';

export default async function ProductsPage() {
  const products = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    next: { tags: [CATALOG_TAG] },
  }).then(r => r.json());

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Catalog</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p: any) => (
          <a key={p.id} href={`/products/${p.slug}`} className="border rounded p-4 block hover:shadow">
            <div className="text-lg font-medium">{p.name}</div>
            <div className="opacity-70">Rp {p.price.toLocaleString('id-ID')}</div>
            <div className={`mt-2 text-sm ${p.qty>0?'text-green-700':'text-red-700'}`}>Stock: {p.qty}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
