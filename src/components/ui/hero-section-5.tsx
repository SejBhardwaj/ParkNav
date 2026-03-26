"use client";
import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Milestone {
  id: number;
  name: string;
  status: "complete" | "in-progress" | "pending";
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

interface AnimatedRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
  milestones: Milestone[];
  mapImageSrc: string;
}

const MilestoneMarker = ({ milestone }: { milestone: Milestone }) => {
  const statusClasses = {
    complete: "bg-green-500 border-green-700",
    "in-progress": "bg-blue-500 border-blue-700 animate-pulse",
    pending: "bg-gray-600 border-gray-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: milestone.id * 0.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
      className="absolute flex items-center gap-2"
      style={milestone.position}
    >
      <div className="relative flex h-6 w-6 items-center justify-center flex-shrink-0">
        <div className={cn("absolute h-2.5 w-2.5 rounded-full border-2", statusClasses[milestone.status])} />
        <div className="absolute h-full w-full rounded-full bg-white/5" />
      </div>
      <div className="rounded-full border border-white/20 bg-gray-900/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white shadow-lg whitespace-nowrap">
        {milestone.name}
      </div>
    </motion.div>
  );
};

const AnimatedRoadmap = React.forwardRef<HTMLDivElement, AnimatedRoadmapProps>(
  ({ className, milestones, mapImageSrc, ...props }, _ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });
    const pathLength = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

    return (
      <div
        ref={targetRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        <div className="relative h-[340px]">
          {/* Map image */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 5 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={mapImageSrc}
              alt="Map"
              className="h-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* SVG animated path */}
          <svg
            width="100%" height="100%"
            viewBox="0 0 400 340"
            preserveAspectRatio="none"
            className="absolute inset-0 pointer-events-none"
          >
            <motion.path
              d="M 60 280 Q 150 80 200 180 T 340 80"
              fill="none"
              stroke="rgba(99,179,237,0.6)"
              strokeWidth="2"
              strokeDasharray="8 4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {/* Milestones */}
          {milestones.map((m) => (
            <MilestoneMarker key={m.id} milestone={m} />
          ))}
        </div>
      </div>
    );
  }
);

AnimatedRoadmap.displayName = "AnimatedRoadmap";
export { AnimatedRoadmap };
