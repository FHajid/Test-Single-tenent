import Link from "next/link";
import Image from "next/image";
import ProductsPage from "./products/page";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          
          <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
            Demo E-Commerce
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-zinc-700 transition hover:text-black dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="rounded-full bg-black px-4 py-2 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Lihat Produk
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative mx-auto max-w-6xl px-6 pb-20 pt-12">
        {/* subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10  from-white via-white/70 to-transparent dark:from-black dark:via-black/60" />

        <section className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Temukan Produk Demo yang Menarik
            </h1>
            <p className="max-w-xl text-lg text-zinc-300">
              Jelajahi katalog produk demo kami — cocok untuk percobaan integrasi,
              demo, atau belajar. Semua produk memiliki detail, stok, dan tombol checkout.
            </p>

            <div className="flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-medium text-black shadow hover:bg-zinc-100"
              >
                Telusuri Produk
              </Link>
              <a
                href="#"
                className="inline-flex items-center rounded-md border  px-4 py-3 text-sm text-zinc-300 hover:text-white"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-400" />
                <span>Stok real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-400" />
                <span>Mudah diintegrasikan</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Image 
                src="/poster.jpg"
                alt="Poster produk demo baju"
                width={400}
                height={300}
              />
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Demo E-Commerce • Next.js App Router • Supabase • Tailwind
        </footer>
      </main>
    </div>
  );
}
