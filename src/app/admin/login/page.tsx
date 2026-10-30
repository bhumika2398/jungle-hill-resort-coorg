import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-dvh place-items-center bg-surface px-[var(--spacing-gutter)] py-10">
      <div className="shadow-soft w-full max-w-sm rounded-[10px] border border-line bg-card p-6 sm:p-8">
        <p className="label-mono text-small tracking-widest uppercase">
          Jungle Hill Resort
        </p>
        <h1 className="mt-2 font-display text-h4">Admin sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
