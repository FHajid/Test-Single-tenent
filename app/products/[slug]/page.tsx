import ProductTabs from '@/components/ProductTabs';

export default async function ProductDetail({ params }:{ params: { slug: string }}) {
  const product = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.slug}`, { cache: 'no-store' }).then(r => r.json());

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <div className="opacity-70 mb-2">Rp {product.price.toLocaleString('id-ID')}</div>
      <div className={`text-sm ${product.qty>0?'text-green-700':'text-red-700'}`}>Stock: {product.qty}</div>
      <ProductTabs description={product.description} specs={product.specs} reviews={[]} />
      <form className="mt-4" action="/api/checkout" method="POST">
        <button
          formAction={async () => {
            'use server';
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: product.id }),
            });
          }}
          className="mt-2 px-4 py-2 rounded bg-black text-white"
        >
          Fake Checkout
        </button>
      </form>
    </main>
  );
}
