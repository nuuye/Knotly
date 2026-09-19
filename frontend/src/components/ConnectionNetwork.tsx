import { useEffect, useRef } from "react";

type NetworkVariant = "login" | "signup";

interface NetworkPoint {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

interface NetworkEdge {
    from: number;
    to: number;
    opacity: number;
    width?: number;
}

interface ConnectionNetworkProps {
    className?: string;
    variant: NetworkVariant;
}

const LOGIN_POINTS: NetworkPoint[] = [
    { x: 0.64, y: 0.05, radius: 5, opacity: 0.72 },
    { x: 0.79, y: 0.19, radius: 11, opacity: 0.28 },
    { x: 0.97, y: 0.1, radius: 6, opacity: 0.82 },
    { x: 0.89, y: 0.34, radius: 5, opacity: 0.46 },
    { x: 0.025, y: 0.25, radius: 7, opacity: 0.24 },
    { x: 0.18, y: 0.41, radius: 4, opacity: 0.58 },
    { x: 0.09, y: 0.62, radius: 6, opacity: 0.34 },
    { x: 0.03, y: 0.88, radius: 7, opacity: 0.56 },
    { x: 0.22, y: 0.96, radius: 13, opacity: 0.25 },
    { x: 0.39, y: 0.79, radius: 5, opacity: 0.74 },
    { x: 0.56, y: 0.94, radius: 5, opacity: 0.66 },
    { x: 0.73, y: 0.7, radius: 9, opacity: 0.4 },
    { x: 0.98, y: 0.85, radius: 5, opacity: 0.64 },
    { x: 0.89, y: 0.55, radius: 7, opacity: 0.28 },
];

const LOGIN_EDGES: NetworkEdge[] = [
    { from: 0, to: 1, opacity: 0.38 }, { from: 1, to: 2, opacity: 0.55, width: 1.4 },
    { from: 1, to: 3, opacity: 0.24 },
    { from: 4, to: 5, opacity: 0.3 }, { from: 5, to: 6, opacity: 0.44, width: 1.4 },
    { from: 7, to: 8, opacity: 0.48 }, { from: 8, to: 9, opacity: 0.3 },
    { from: 10, to: 11, opacity: 0.28 }, { from: 11, to: 12, opacity: 0.5, width: 1.5 },
    { from: 11, to: 13, opacity: 0.36 },
];

const SIGNUP_POINTS: NetworkPoint[] = [
    { x: 0.71, y: 0.03, radius: 5, opacity: 0.7 },
    { x: 0.83, y: 0.15, radius: 10, opacity: 0.3 },
    { x: 0.98, y: 0.05, radius: 6, opacity: 0.82 },
    { x: 0.92, y: 0.29, radius: 4, opacity: 0.48 },
    { x: 0.03, y: 0.11, radius: 7, opacity: 0.25 },
    { x: 0.17, y: 0.25, radius: 5, opacity: 0.62 },
    { x: 0.04, y: 0.43, radius: 6, opacity: 0.38 },
    { x: 0.04, y: 0.68, radius: 8, opacity: 0.38 },
    { x: 0.19, y: 0.94, radius: 12, opacity: 0.26 },
    { x: 0.39, y: 0.84, radius: 5, opacity: 0.72 },
    { x: 0.63, y: 0.75, radius: 7, opacity: 0.32 },
    { x: 0.87, y: 0.57, radius: 9, opacity: 0.4 },
    { x: 0.98, y: 0.79, radius: 6, opacity: 0.64 },
    { x: 0.76, y: 0.97, radius: 5, opacity: 0.3 },
];

const SIGNUP_EDGES: NetworkEdge[] = [
    { from: 0, to: 1, opacity: 0.46 }, { from: 1, to: 2, opacity: 0.56, width: 1.5 },
    { from: 1, to: 3, opacity: 0.34 },
    { from: 4, to: 5, opacity: 0.24 }, { from: 5, to: 6, opacity: 0.46 },
    { from: 7, to: 8, opacity: 0.5, width: 1.5 }, { from: 8, to: 9, opacity: 0.36 },
    { from: 10, to: 11, opacity: 0.26 }, { from: 11, to: 12, opacity: 0.48 },
    { from: 10, to: 13, opacity: 0.4 },
];

export function ConnectionNetwork({ className, variant }: ConnectionNetworkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const points = variant === "login" ? LOGIN_POINTS : SIGNUP_POINTS;
        const edges = variant === "login" ? LOGIN_EDGES : SIGNUP_EDGES;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const variantPhase = variant === "login" ? 0 : 0.73;
        let width = 0;
        let height = 0;
        let ratio = 1;
        let animationFrame = 0;
        let lastFrame = 0;

        const resize = () => {
            const bounds = canvas.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;
            ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);
        };

        const draw = (time: number) => {
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.clearRect(0, 0, width, height);
            context.lineCap = "round";

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
