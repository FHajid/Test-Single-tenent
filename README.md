🛍️ Single-Tenant E-Commerce Prototype

Next.js App Router + Supabase + SSR Incremental Rendering

📖 Deskripsi Singkat

Prototype ini adalah toko online single-tenant (brand A) yang dibangun dengan Next.js App Router 16, menggunakan Server-Side Rendering (SSR) untuk halaman katalog, Supabase sebagai penyimpanan data, dan simulasi checkout fake dengan penanganan race condition.

Tujuan proyek ini adalah mendemonstrasikan:

Incremental SSR pada katalog produk.

Tabs interaktif di halaman detail produk.

Simulasi transaksi checkout yang mengurangi stok dengan aman (atomic operation).

Cache invalidation berbasis tag.

Struktur proyek siap multi-tenant bila ingin diperluas.

⚙️ Fitur Utama
Fitur	Deskripsi
SSR Incremental	Katalog /products di-render di server dengan tag cache catalog, dan otomatis invalid saat stok berubah.
Tabs Produk	Komponen ProductTabs menampilkan Description, Specs, dan Reviews tiap produk.
Fake Checkout	Server Action memanggil fungsi PostgreSQL RPC checkout_atomic yang menurunkan stok.
Race Condition Safe	Dua request simultan hanya satu yang berhasil — transaksi dijalankan atomically di DB.
Supabase Integration	Menggunakan table products dan stock + policy RLS untuk akses aman.
Server Actions + Revalidate Tag	Setelah checkout berhasil, cache katalog di-invalidate otomatis.
🧩 Teknologi

Next.js 16 (App Router) – SSR & Server Actions

TypeScript

Supabase (PostgreSQL) – database & RPC

Tailwind CSS – styling

Vercel Deployment – hosting & Edge runtime

💾 Struktur Database (Supabase)
Table	Kolom	Deskripsi
products	id, slug, name, price, description, specs	Data dasar produk
stock	product_id, qty	Jumlah stok
orders (mock)	id, product_id, created_at	Penyimpanan pesanan fake
checkout_atomic (RPC)	p_product_id INT	Fungsi yang mengurangi stok bila stok > 0

Contoh RPC
create or replace function checkout_atomic(p_product_id int)
returns boolean as $$
declare
  _ok boolean := false;
begin
  update stock
  set qty = qty - 1
  where product_id = p_product_id and qty > 0
  returning true into _ok;

  if _ok then
    insert into orders (product_id) values (p_product_id);
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql;

🧠 Arsitektur Sistem
[ Browser ]
   │   GET /products  → SSR + cache tag "catalog"
   ▼
[ Next.js App Router ]
   ├─ Server Action checkoutAction()
   │     ↳ Supabase RPC checkout_atomic()
   │     ↳ revalidateTag('catalog')
   └─ Render halaman & tabs produk
   ▼
[ Supabase ]
   ├─ Table: products, stock
   └─ Function: checkout_atomic()

🔐 Mekanisme Cache & Invalidasi
Langkah	Penjelasan
1	/products di-fetch dengan next: { tags: ['catalog'] }.
2	Saat checkout, server action memanggil revalidateTag('catalog').
3	Next.js re-render halaman katalog di permintaan berikutnya.
⚔️ Penanganan Race Condition

Dua request POST checkout dikirim bersamaan.

RPC checkout_atomic menjalankan UPDATE ... WHERE qty > 0 di satu transaksi.

Satu berhasil (true), lainnya gagal (false, HTTP 409).

Hasil bisa diuji manual via script scripts/race-test.js:

node scripts/race-test.js 1


Output: satu status 200 ✅, sisanya 409 ⚠️.

🚀 Menjalankan Project Lokal
# 1. Clone & install
git clone <repo-url>
cd test_sd_insoft
npm install

# 2. Salin env
cp .env.example .env.local
# isi dengan key Supabase milikmu

# 3. Jalankan dev server
npm run dev

Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

🧪 Seed Data

Bisa jalankan di SQL Editor Supabase:

insert into products (slug,name,price,description,specs)
values
('hoodie-beta','Hoodie Beta',249000,'Hoodie nyaman','Cotton 280gsm'),
('watch-gamma','Watch Gamma',499000,'Jam tangan','Quartz movement');

insert into stock (product_id,qty)
select id,5 from products;

🧰 Scripts Tambahan
Script	Fungsi
npm run dev	Jalankan lokal
npm run build	Build production
npm run start	Jalankan hasil build
npm run db:seed	(opsional) seeding data
npm run test:race	Simulasi race condition checkout
🧱 Trade-Offs
Aspek	Pilihan	Alasan
SSR Incremental	Tag-based revalidation	Cache granular, mudah invalidasi
Fake Checkout	RPC atomic	Aman dari race condition
DB Access	Supabase SDK	Simpel & langsung tanpa REST
Caching	Tag cache	Skalabel; cocok untuk Next 16
UI Theme	Tailwind	Cepat prototyping
🧩 Langkah Reproduksi Race Condition

Set stock.qty = 1 untuk salah satu produk.

Jalankan:

seq 1 5 | xargs -I{} -P5 curl -s -o /dev/null -w "%{http_code}\n" \
-X POST https://https://test-single-tenent.vercel.app/api/checkout \
-H "Content-Type: application/json" \
-d '{"productId":1}'


Hasil: satu 200 ✅ dan beberapa 409 ❌.

🖼️ Demo

Production: https://test-single-tenent.vercel.app

Local: http://localhost:3000