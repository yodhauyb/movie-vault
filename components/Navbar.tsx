import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Website Title changed to Movie Vault */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-wider text-white sm:text-2xl">
            Movie <span className="text-amber-400">Vault</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition hover:text-amber-400"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-slate-300 transition hover:text-amber-400"
          >
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}