"use client";

import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const drawAurora = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Warm oatmeal base
      ctx.fillStyle = "#fdfbf7";
      ctx.fillRect(0, 0, w, h);

      // Warm floating glow orbs — clay, citrus, peach tones
      const orbs = [
        {
          // Top-left: warm clay glow
          x: w * 0.15 + Math.sin(time * 0.00042) * w * 0.10,
          y: h * 0.20 + Math.cos(time * 0.00035) * h * 0.08,
          r: w * 0.55,
          colorInner: "rgba(224, 122, 95, 0.10)",
          colorMid: "rgba(224, 122, 95, 0.04)",
        },
        {
          // Top-right: soft citrus
          x: w * 0.82 + Math.cos(time * 0.00038) * w * 0.09,
          y: h * 0.18 + Math.sin(time * 0.00050) * h * 0.07,
          r: w * 0.48,
          colorInner: "rgba(244, 162, 97, 0.09)",
          colorMid: "rgba(244, 162, 97, 0.03)",
        },
        {
          // Center: deep warm peach
          x: w * 0.50 + Math.sin(time * 0.00028) * w * 0.07,
          y: h * 0.42 + Math.cos(time * 0.00040) * h * 0.09,
          r: w * 0.52,
          colorInner: "rgba(232, 146, 122, 0.07)",
          colorMid: "rgba(232, 146, 122, 0.02)",
        },
        {
          // Bottom-left: terracotta
          x: w * 0.10 + Math.cos(time * 0.00055) * w * 0.06,
          y: h * 0.75 + Math.sin(time * 0.00042) * h * 0.08,
          r: w * 0.42,
          colorInner: "rgba(201, 96, 74, 0.07)",
          colorMid: "rgba(201, 96, 74, 0.02)",
        },
        {
          // Bottom-right: warm amber
          x: w * 0.88 + Math.sin(time * 0.00032) * w * 0.07,
          y: h * 0.72 + Math.cos(time * 0.00045) * h * 0.07,
          r: w * 0.38,
          colorInner: "rgba(247, 184, 130, 0.08)",
          colorMid: "rgba(247, 184, 130, 0.03)",
        },
      ];

      orbs.forEach(({ x, y, r, colorInner, colorMid }) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, colorInner);
        grad.addColorStop(0.45, colorMid);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Warm paper texture veil (top stays clean, bottom warms slightly)
      const veil = ctx.createLinearGradient(0, 0, 0, h);
      veil.addColorStop(0, "rgba(253,251,247,0.0)");
      veil.addColorStop(0.6, "rgba(253,251,247,0.0)");
      veil.addColorStop(1, "rgba(245,240,232,0.45)");
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);

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
      className="fixed inset-0 -z-10"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
