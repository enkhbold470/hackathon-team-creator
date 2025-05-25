import { motion } from "@/lib/framer-motion-facade";

interface NoMatchesComponentProps {
  title: string;
  message: string;
}

export default function NoMatchesComponent({
  title,
  message,
}: NoMatchesComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[60vh] text-center"
    >
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <p className="text-muted-foreground">{message}</p>
    </motion.div>
  );
}
