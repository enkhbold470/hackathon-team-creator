"use client";

import { Button } from "@/components/ui/button";
import { motion } from "@/lib/framer-motion-facade";
import { useRouter } from "next/navigation";

interface ErrorComponentProps {
  error: string | null;
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.refresh()} className="mt-4">
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}
