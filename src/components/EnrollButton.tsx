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
            // Add this line so the button resets after the background refresh finishes!
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleEnroll}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 mt-4 shadow-md"
        >
            <Lock className="w-5 h-5 mr-2" />
            {loading ? "Enrolling..." : "Enroll to Unlock Course"}
        </Button>
    );
}