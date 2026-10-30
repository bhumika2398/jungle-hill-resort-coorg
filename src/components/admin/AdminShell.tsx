"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BedDouble,
  ExternalLink,
  FolderOpen,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  UtensilsCrossed,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/rooms", label: "Rooms and prices", icon: BedDouble },
  { href: "/admin/restaurant", label: "Restaurant", icon: UtensilsCrossed },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/media", label: "Media library", icon: FolderOpen },
] as const;

interface AdminShellProps {
  email: string;
  signOut: () => void | Promise<void>;
  children: ReactNode;
}

/** Admin frame: fixed left navigation on desktop, a slide-out drawer on small screens. No top bar. */
export function AdminShell({ email, signOut, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const link = (active: boolean) =>
    `flex min-h-11 items-center gap-3 rounded-[6px] px-3 text-small transition-colors ${
      active ? "bg-burgundy text-ivory" : "hover:bg-olive/15"
    }`;

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-1 pt-1">
        <Link
          href="/admin"
          onClick={() => setOpen(false)}
          className="font-display text-h4 leading-none"
        >
          Jungle Hill
        </Link>
        <p className="label-mono mt-1.5 text-[0.7rem]">Admin panel</p>
      </div>

      <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active =
            "exact" in item ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={link(active)}
            >
              <item.icon size={18} strokeWidth={1.6} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
        <Link href="/" target="_blank" rel="noopener" className={`${link(false)} mt-2`}>
          <ExternalLink size={18} strokeWidth={1.6} aria-hidden="true" />
          View site
        </Link>
      </nav>

      <form action={signOut} className="border-t border-line pt-4">
        <p className="truncate px-1 text-small" title={email}>
          {email}
        </p>
        <button type="submit" className={`${link(false)} mt-2 w-full border border-line`}>
          <LogOut size={18} strokeWidth={1.6} aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface text-body">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto border-r border-line bg-card lg:block">
        {sidebar}
      </aside>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="shadow-soft fixed top-3 left-3 z-30 grid h-11 w-11 place-items-center rounded-[6px] border border-line bg-card lg:hidden"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-burgundy/40"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-line bg-card">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-[6px] border border-line"
            >
              <X size={18} aria-hidden="true" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <main className="px-[var(--spacing-gutter)] pt-16 pb-10 lg:pt-8 lg:pl-[calc(16rem+var(--spacing-gutter))]">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
