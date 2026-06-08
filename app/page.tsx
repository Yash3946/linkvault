import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <main className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            LinkVault
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Save links. Share what matters.
          </h1>
          <p className="mx-auto max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A simple bookmark manager with public profiles and private collections.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-11 min-w-36 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 min-w-36 items-center justify-center rounded-lg border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 min-w-36 items-center justify-center rounded-lg border border-transparent px-5 text-sm font-medium text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
