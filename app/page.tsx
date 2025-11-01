import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
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
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/70 to-transparent dark:from-black dark:via-black/60" />
        <section className="grid items-center gap-10 md:grid-cols-2">
          

        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Demo E-Commerce • Next.js App Router • Supabase • Tailwind
        </footer>
      </main>
    </div>
  );
}
