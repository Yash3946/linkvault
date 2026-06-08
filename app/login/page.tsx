import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in | LinkVault",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your bookmarks."
      footer={
        <p>
          By continuing, you agree to use LinkVault responsibly.
        </p>
      }
    >
      <Suspense fallback={<p className="text-center text-sm text-zinc-500">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
