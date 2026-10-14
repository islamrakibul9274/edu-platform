"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, Sparkles, CheckCircle2, Lock, ArrowRight, ShieldCheck } from "lucide-react";

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
        setError("Invalid email or password. Please check your credentials.");
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
    <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Column: Visual Showcase */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tight">EduPlatform.</span>
            </Link>

            <div className="pt-8 space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Student Learning Center
              </span>
              <h2 className="text-3xl font-black leading-tight tracking-tight">
                Accelerate your software engineering journey.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Log back in to resume your active modules, submit questions to instructors, and review your verified credentials.
              </p>
            </div>

            <div className="space-y-3 pt-4 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Next.js 16, Computer Vision & DevOps Tracks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant resume on your active lesson</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Printable industry certificate verification</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} EduPlatform LMS</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Secure Sessions
            </span>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Column: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your courses and dashboard.
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-blue-900 font-medium">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Testing out the platform?</span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs hover:bg-blue-50 transition-colors"
            >
              ⚡ Fill Demo Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                <Link href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all mt-2"
            >
              {loading ? "Signing in..." : "Sign In to EduPlatform"}
            </Button>

          </form>

          <div className="mt-8 text-center text-xs text-slate-500 pt-6 border-t border-slate-100">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-blue-600 font-bold hover:underline">
              Create an account for free
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}