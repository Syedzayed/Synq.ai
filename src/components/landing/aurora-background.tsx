"use client";

import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawAurora = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Deep black base
      ctx.fillStyle = "#020206";
      ctx.fillRect(0, 0, width, height);

      const orbs = [
        {
          x: width * 0.2 + Math.sin(time * 0.0007) * width * 0.15,
          y: height * 0.3 + Math.cos(time * 0.0005) * height * 0.1,
          r: width * 0.55,
          color: "rgba(79, 70, 229, 0.13)", // indigo
        },
        {
          x: width * 0.75 + Math.cos(time * 0.0006) * width * 0.12,
          y: height * 0.25 + Math.sin(time * 0.0008) * height * 0.08,
          r: width * 0.5,
          color: "rgba(109, 40, 217, 0.11)", // violet
        },
        {
          x: width * 0.5 + Math.sin(time * 0.0004) * width * 0.1,
          y: height * 0.6 + Math.cos(time * 0.0006) * height * 0.12,
          r: width * 0.45,
          color: "rgba(59, 130, 246, 0.08)", // blue
        },
        {
          x: width * 0.15 + Math.cos(time * 0.0009) * width * 0.08,
          y: height * 0.7 + Math.sin(time * 0.0007) * height * 0.1,
          r: width * 0.38,
          color: "rgba(139, 92, 246, 0.07)", // purple
        },
      ];

      orbs.forEach(({ x, y, r, color }) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // Subtle noise veil
      const noiseGrad = ctx.createLinearGradient(0, 0, 0, height);
      noiseGrad.addColorStop(0, "rgba(2,2,6,0.0)");
      noiseGrad.addColorStop(1, "rgba(2,2,6,0.6)");
      ctx.fillStyle = noiseGrad;
      ctx.fillRect(0, 0, width, height);

      time++;
      animationId = requestAnimationFrame(drawAurora);
    };

    drawAurora();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
