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
      className={`text-slate-600 hover:text-red-600 hover:bg-red-50/80 transition-colors border-slate-200/80 ${className}`}
    >
      <LogOut className="w-3.5 h-3.5 mr-1.5" />
      Sign Out
    </Button>
  );
}