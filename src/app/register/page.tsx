"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, ShieldCheck, Check } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const dest = callbackUrl 
          ? `/login?registered=true&callbackUrl=${encodeURIComponent(callbackUrl)}` 
          : "/login?registered=true";
        router.push(dest);
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed. Please check inputs.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl bg-[#111114] border border-zinc-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: Specs */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-950 border-r border-zinc-850 text-zinc-100 relative">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="font-bold text-base tracking-tight">EduPlatform</span>
          </Link>

          <div className="pt-6 space-y-2">
            <span className="mono-tag text-zinc-500">
              DEVELOPER REGISTRATION
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Join 15,000+ engineers building production systems.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Create your account to enroll in tracks, stream verified lecture content, participate in code reviews, and earn cryptographic certificates.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full curriculum access & video unlocking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-time completion telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free sandbox & project blueprints</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 text-[11px] font-mono text-zinc-600 flex items-center justify-between">
          <span>SECURE TLS 1.3</span>
          <span className="flex items-center gap-1 text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> ENCRYPTED_STORAGE
          </span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="p-8 sm:p-10 flex flex-col justify-center bg-[#111114]">
        
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">Create student account</h1>
          <p className="text-xs text-zinc-400">
            Initialize your profile to enroll in engineering tracks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <Label htmlFor="name" className="mono-tag text-zinc-400">FULL NAME</Label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Rivers"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 rounded-lg bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-xs text-zinc-200 placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="mono-tag text-zinc-400">WORK / DEV EMAIL</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-10 rounded-lg bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-xs text-zinc-200 placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="mono-tag text-zinc-400">PASSWORD (MIN 6 CHARS)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-10 rounded-lg bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-xs text-zinc-200 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/60 text-xs font-mono text-red-400">
              {error}
            </div>
          )}

          <Button
            disabled={loading}
            type="submit"
            className="w-full h-10 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg transition-all mt-2 cursor-pointer"
          >
            {loading ? "Creating Profile..." : "Initialize Account"}
          </Button>

        </form>

        <div className="mt-8 text-center text-xs text-zinc-500 pt-5 border-t border-zinc-850">
          Already have an account?{" "}
          <Link 
            href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"} 
            className="text-zinc-300 font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#09090b]">
      <Suspense fallback={<div className="text-zinc-500 font-mono text-xs">Loading registration form...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}