"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
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
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Column: Visual Showcase */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tight">EduPlatform.</span>
            </Link>

            <div className="pt-8 space-y-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Start Learning Today
              </span>
              <h2 className="text-3xl font-black leading-tight tracking-tight">
                Join a global network of ambitious engineers.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Create your student profile in seconds. Unlock all course preview lectures, track your milestones, and graduate with industry-recognized certificates.
              </p>
            </div>

            <div className="space-y-3 pt-4 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero tuition or subscription fees for core tracks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Step-by-step full-stack and AI project repositories</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct access to community discussions and peer reviews</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>© {new Date().getFullYear()} EduPlatform LMS</span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> GDPR & Privacy Protected
            </span>
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Column: Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="mb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-500">
              Start your journey into production full-stack engineering and AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all mt-2"
            >
              {loading ? "Creating your account..." : "Sign Up Free"}
            </Button>

          </form>

          <div className="mt-8 text-center text-xs text-slate-500 pt-6 border-t border-slate-100">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Sign in here
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}