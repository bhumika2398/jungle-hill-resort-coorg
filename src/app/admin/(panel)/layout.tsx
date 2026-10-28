import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { logout } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

// Every admin page needs the signed-in session and live data, so none of it is ever prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return (
    <AdminShell email={admin.email ?? "Admin"} signOut={logout}>
      {children}
    </AdminShell>
  );
}
