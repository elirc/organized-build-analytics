import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { login } from "../api/auth.api";
import { useAuthStore } from "./auth.store";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "system_admin@example.com",
      password: "Password123!"
    }
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      navigate("/");
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Analytics Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in to the control room</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Use a seeded role account after running the backend seed.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3" {...form.register("email")} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              type="password"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              {...form.register("password")}
            />
          </label>
          {errorMessage ? <p className="text-sm text-[var(--danger)]">{errorMessage}</p> : null}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
