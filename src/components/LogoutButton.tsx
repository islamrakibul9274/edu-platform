"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-slate-600 hover:text-red-600 hover:bg-red-50"
    >
      Sign Out
    </Button>
  );
}