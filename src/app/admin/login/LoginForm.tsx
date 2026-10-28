"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/actions";

const field =
  "mt-1 block w-full min-h-11 rounded-[6px] border border-line bg-card px-3 py-2 text-body focus:border-burgundy focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-small">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className={field}
        />
      </label>
      <label className="block text-small">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-small font-medium">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 w-full rounded-[6px] bg-burgundy px-4 text-small text-ivory disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
