"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ variant = "outline", className = "" }: { variant?: "outline" | "ghost" | "default", className?: string }) {
  return (
    <Button 
      variant={variant}
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      className={`text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border-zinc-800 text-xs transition-colors ${className}`}
    >
      <LogOut className="w-3.5 h-3.5 mr-1.5" />
      Sign Out
    </Button>
  );
}