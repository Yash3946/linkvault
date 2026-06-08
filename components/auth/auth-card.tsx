import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-8 space-y-2 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            LinkVault
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
        {children}
        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {footer}
        </div>
      </div>
    </div>
  );
}
