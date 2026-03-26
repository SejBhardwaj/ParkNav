"use client";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number; y: number; width: number; length: number;
  angle: number; speed: number; opacity: number;
  hue: number; pulse: number; pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 80 + Math.random() * 120,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.25 + Math.random() * 0.15,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({ className, intensity = "strong", children }: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 12; // Reduced from 20
  const opacityMap = { subtle: 0.5, medium: 0.65, strong: 0.8 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, canvas.parentElement?.scrollHeight || window.innerHeight);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      beamsRef.current = Array.from({ length: MINIMUM_BEAMS }, () =>
        createBeam(w, h)
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;
      const column = index % 3;
      const w = parseInt(canvas.style.width);
      const h = parseInt(canvas.style.height);
      const spacing = w / 3;
      beam.y = h + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 120;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.25 + Math.random() * 0.15;
      return beam;
    }

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);
      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];

      // Wide soft colored glow — low opacity, keeps the color
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0,   `hsla(${beam.hue}, 90%, 65%, 0)`);
      gradient.addColorStop(0.1, `hsla(${beam.hue}, 90%, 65%, ${pulsingOpacity * 0.3})`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 90%, 65%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 90%, 65%, ${pulsingOpacity * 0.5})`);
      gradient.addColorStop(0.9, `hsla(${beam.hue}, 90%, 65%, ${pulsingOpacity * 0.3})`);
      gradient.addColorStop(1,   `hsla(${beam.hue}, 90%, 65%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);

      // Narrow bright shiny core
      const core = ctx.createLinearGradient(0, 0, 0, beam.length);
      core.addColorStop(0,   `hsla(${beam.hue}, 100%, 92%, 0)`);
      core.addColorStop(0.1, `hsla(${beam.hue}, 100%, 92%, ${pulsingOpacity * 0.7})`);
      core.addColorStop(0.4, `hsla(${beam.hue}, 100%, 92%, ${pulsingOpacity})`);
      core.addColorStop(0.6, `hsla(${beam.hue}, 100%, 92%, ${pulsingOpacity})`);
      core.addColorStop(0.9, `hsla(${beam.hue}, 100%, 92%, ${pulsingOpacity * 0.7})`);
      core.addColorStop(1,   `hsla(${beam.hue}, 100%, 92%, 0)`);
      ctx.fillStyle = core;
      ctx.fillRect(-beam.width * 0.06, 0, beam.width * 0.12, beam.length);

      ctx.restore();
    }

    let lastTime = performance.now();
    const targetFPS = 30; // Limit to 30fps instead of 60fps
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime: number) {
      if (!canvas || !ctx) return;
      
      const elapsed = currentTime - lastTime;
      if (elapsed < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime - (elapsed % frameInterval);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = "blur(20px)"; // Reduced blur
      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        const h = parseInt(canvas.style.height);
        if (beam.y + beam.length < -100) resetBeam(beam, index, totalBeams);
        if (beam.y < -beam.length - 100) {
          beam.y = h + 100;
        }
        drawBeam(ctx, beam);
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate(performance.now());
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div className={cn("relative w-full bg-neutral-950", className)}>
      {/* Canvas covers full scrollable height, positioned absolute */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ filter: "blur(8px)", zIndex: 0 }}
      />
      <motion.div
        className="absolute inset-0 bg-neutral-950/10 pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      />
      <div className="relative w-full" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
