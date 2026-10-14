"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X, BookOpen, LayoutDashboard, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

interface NavbarProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
    } | null;
  } | null;
}

export default function Navbar({ session }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/courses", label: "Catalog", icon: BookOpen },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const user = session?.user;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 w-full glass-nav-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between">
          
          {/* Brand Logo - 2026 Minimalist Technical Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-black text-sm group-hover:bg-zinc-200 transition-colors">
              <Terminal className="w-4 h-4 text-zinc-950" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                EduPlatform
              </span>
              <span className="mono-tag text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                v2.6
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "text-zinc-100 bg-zinc-900 border border-zinc-850"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-200" : "text-zinc-500"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 py-1 px-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-200 font-mono font-bold text-xs flex items-center justify-center">
                    {initial}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="font-medium text-xs text-zinc-200 line-clamp-1 max-w-[110px]">{user?.name}</p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button variant="ghost" size="sm" asChild className="text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="text-xs bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold rounded-lg shadow-xs">
                  <Link href="/register">Start Learning</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-5 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? "text-zinc-100 bg-zinc-900 border border-zinc-800"
                      : "text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-900">
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-zinc-900/60 border border-zinc-850 rounded-lg">
                  <div className="w-7 h-7 rounded-md bg-zinc-800 text-zinc-200 font-bold text-xs flex items-center justify-center">
                    {initial}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{user?.name}</p>
                    <p className="text-[10px] text-zinc-500">{user?.email}</p>
                  </div>
                </div>
                <div className="px-1">
                  <LogoutButton className="w-full justify-center" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-1">
                <Button variant="outline" size="sm" asChild className="w-full border-zinc-800 text-zinc-300">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button size="sm" asChild className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Start Learning</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
