"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);

    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    if (res.ok) {
      router.refresh();
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold text-xs h-10 rounded-lg shadow-sm"
    >
      <Lock className="w-3.5 h-3.5 mr-1.5" />
      {loading ? "Authorizing Enrollment..." : "Enroll to Unlock Track"}
    </Button>
  );
}