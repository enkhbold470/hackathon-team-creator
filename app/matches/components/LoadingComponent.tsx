import { motion } from "@/lib/framer-motion-facade";

export default function LoadingComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center"
    >
      <p>Loading...</p>
    </motion.div>
  );
}
