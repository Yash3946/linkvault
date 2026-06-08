import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign up | LinkVault",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Start saving and sharing your favorite links."
      footer={
        <p>
          A unique handle is created automatically for your public profile.
        </p>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
