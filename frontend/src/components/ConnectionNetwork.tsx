import { useEffect, useRef } from "react";
import { CONNECTION_LAYOUTS } from "../data/connectionNetwork";
import type { ConnectionNetworkProps } from "../types/connectionNetwork";

/** Draws the small animated networks used on the login and signup pages. */
export function ConnectionNetwork({ className, variant }: ConnectionNetworkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // The canvas is decorative, so stop early if the browser cannot draw it.
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const { points, edges } = CONNECTION_LAYOUTS[variant];
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const variantPhase = variant === "login" ? 0 : 0.73;
        let width = 0;
        let height = 0;
        let ratio = 1;
        let animationFrame = 0;
        let lastFrame = 0;

        // Match the canvas pixels to its visible size and keep retina screens sharp.
        const resize = () => {
            const bounds = canvas.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;
            ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
        };

        // Draw one frame. Points move only a few pixels to keep the effect calm.
        const draw = (time: number) => {
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.clearRect(0, 0, width, height);
            context.lineCap = "round";

            // Convert relative positions into pixels and add a small floating motion.
            const positionedPoints = points.map((point, index) => {
                const phase = index * 1.71 + variantPhase;
                const speed = 0.0001 + (index % 4) * 0.000014;
                const amplitude = reduceMotion ? 0 : 1.6 + (index % 3) * 0.75;

                return {
                    ...point,
                    drawX: point.x * width + Math.sin(time * speed + phase) * amplitude,
                    drawY: point.y * height + Math.cos(time * speed * 0.81 + phase * 1.27) * amplitude,
                };
            });

            // Lines are drawn before points so nodes always stay visible on top.
            edges.forEach((edge) => {
                const start = positionedPoints[edge.from];
                const end = positionedPoints[edge.to];
                context.beginPath();
                context.moveTo(start.drawX, start.drawY);
                context.lineTo(end.drawX, end.drawY);
                context.strokeStyle = `rgba(255, 155, 55, ${edge.opacity})`;
                context.lineWidth = edge.width ?? 1;
                context.stroke();
            });

            // Keep point sizes balanced when the panel becomes smaller or larger.
            const scale = Math.max(0.78, Math.min(1.25, Math.min(width, height) / 720));
            positionedPoints.forEach((point) => {
                const radius = point.radius * scale;

                context.beginPath();
                context.arc(point.drawX, point.drawY, radius * 2.15, 0, Math.PI * 2);
                context.fillStyle = `rgba(232, 93, 4, ${point.opacity * 0.09})`;
                context.fill();

                context.beginPath();
                context.arc(point.drawX, point.drawY, radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(255, 139, 38, ${point.opacity})`;
                context.fill();
            });
        };

        // About 30 frames per second is enough for this slow background motion.
        const animate = (time: number) => {
            if (time - lastFrame >= 32) {
                draw(time);
                lastFrame = time;
            }
            animationFrame = window.requestAnimationFrame(animate);
        };

        resize();
        if (reduceMotion) draw(0);
        else animationFrame = window.requestAnimationFrame(animate);

        // Redraw whenever the auth panel changes size.
        const observer = new ResizeObserver(() => {
            resize();
            if (reduceMotion) draw(0);
        });
        observer.observe(canvas);
        return () => {
            observer.disconnect();
            window.cancelAnimationFrame(animationFrame);
        };
    }, [variant]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
