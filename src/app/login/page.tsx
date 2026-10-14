"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, ShieldCheck, Zap, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please verify credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo@eduplatform.dev");
    setPassword("password123");
    setError("");
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#09090b]">
      <div className="w-full max-w-4xl rounded-2xl bg-[#111114] border border-zinc-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Column: Technical Terminal Spec */}
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
                STUDENT TERMINAL
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Access your engineering studio.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Resume active modules, track completion telemetry, inspect course materials, and access your verified credentials.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next.js 16, YOLOv8 Vision & DevOps Tracks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant restore on active lecture position</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verifiable cryptographic certificate signing</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 text-[11px] font-mono text-zinc-600 flex items-center justify-between">
            <span>© {new Date().getFullYear()} EDUPLATFORM</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> SECURE_AUTH
            </span>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-[#111114]">
          
          <div className="mb-6 space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Sign in to console</h1>
            <p className="text-xs text-zinc-400">
              Enter your student credentials to proceed.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="mb-6 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-zinc-300" />
              <span>TEST CREDENTIALS</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-mono text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-750 px-2.5 py-1 rounded border border-zinc-700 transition-colors"
            >
              FILL DEMO ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="mono-tag text-zinc-400">EMAIL</Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-xs text-zinc-200 placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="mono-tag text-zinc-400">PASSWORD</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-xs text-zinc-200 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
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
              className="w-full h-10 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold text-xs rounded-lg transition-all mt-2"
            >
              {loading ? "Authenticating..." : "Authorize Session"}
            </Button>

          </form>

          <div className="mt-8 text-center text-xs text-zinc-500 pt-5 border-t border-zinc-850">
            Need an account?{" "}
            <Link href="/register" className="text-zinc-300 font-medium hover:underline">
              Register free
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}