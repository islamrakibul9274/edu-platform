"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  onEnrolled?: (modules?: any[]) => void;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export default function EnrollButton({ courseId, onEnrolled, className, size = "default" }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onEnrolled) {
          onEnrolled(data.modules);
        }
        router.refresh();
      } else if (res.status === 401) {
        router.push(`/login?callbackUrl=/courses/${courseId}`);
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      size={size}
      className={className || "w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-10 rounded-lg shadow-sm transition-all"}
    >
      {loading ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin mr-2" />
          <span>Authorizing Track Credentials...</span>
        </>
      ) : (
        <>
          <Lock className="w-3.5 h-3.5 mr-2" />
          <span>Enroll to Unlock Track</span>
        </>
      )}
    </Button>
  );
}