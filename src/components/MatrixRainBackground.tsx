import { useEffect, useRef } from "react";

const MatrixRainBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    (canvas as HTMLCanvasElement).width = width;
    (canvas as HTMLCanvasElement).height = height;

    // Characters for the rain (binary code style)
    const chars = "01".split("");
    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px Ubuntu, monospace`;
      ctx.fillStyle = "#00ff55";
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      (canvas as HTMLCanvasElement).width = width;
      (canvas as HTMLCanvasElement).height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-10 pointer-events-none select-none"
      style={{ background: "#111" }}
      aria-hidden="true"
    />
  );
};

export default MatrixRainBackground;
