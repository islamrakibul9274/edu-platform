"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function MarkCompleteButton({ courseId, isCompleted }: { courseId: string, isCompleted: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    
    const res = await fetch("/api/complete", {
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

  // If already completed, show a disabled green success state
  if (isCompleted) {
    return (
      <Button disabled className="w-full bg-green-600 text-white opacity-100 disabled:opacity-100">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Completed
      </Button>
    );
  }

  // Otherwise, show the active blue button
  return (
    <Button 
      onClick={handleComplete} 
      disabled={loading} 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? "Updating..." : "Mark as Completed"}
    </Button>
  );
}