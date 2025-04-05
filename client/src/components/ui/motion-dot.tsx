import { motion } from "framer-motion";

interface MotionDotProps {
  className?: string;
  animate?: boolean;
}

export function MotionDot({ className = "", animate = true }: MotionDotProps) {
  return (
    <motion.span
      className={`inline-block h-2.5 w-2.5 rounded-full bg-sunshineYellow ${className}`}
      initial={animate ? { opacity: 0.7 } : undefined}
      animate={animate ? { 
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.1, 1],
      } : undefined}
      transition={animate ? {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      } : undefined}
    />
  );
}

export default MotionDot;
