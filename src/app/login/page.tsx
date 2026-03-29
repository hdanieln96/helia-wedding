"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/dark-logo.png"
            alt="Helia Wedding"
            width={60}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="font-[family-name:var(--font-heading)] text-2xl text-charcoal tracking-wide">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Helia Wedding Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 border border-border">
          <div>
            <Label htmlFor="email" className="text-xs tracking-wider uppercase text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 rounded-none"
              placeholder="admin@heliawedding.com"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs tracking-wider uppercase text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 rounded-none"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal hover:bg-charcoal/90 text-white rounded-none py-5 tracking-wider uppercase text-xs"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
