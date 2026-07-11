import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let hearts = [];
    let sparkles = [];
    // Colores RGB estilo Spider-Man (Rojos y Azules intensos)
    const colors = ["255, 40, 60", "40, 120, 255", "220, 20, 60", "20, 150, 255"];

    // 1. Creador de Corazones (Más grandes y definidos)
    const createHeart = (initY = false) => {
      // Tamaño aumentado: entre 40px y 110px
      const size = Math.random() * 70 + 40; 
      return {
        x: Math.random() * canvas.width,
        y: initY ? Math.random() * canvas.height : canvas.height + Math.random() * 100,
        size: size,
        speed: (Math.random() * 1.5 + 0.5) * (size / 40), 
        opacity: Math.random() * 0.5 + 0.3, // Opacidad más alta para mayor definición
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 360,
        wobbleSpeed: Math.random() * 0.015 + 0.005,
      };
    };

    // 2. Creador de Brillos (Estrellitas/Destellos de luz)
    const createSparkle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, // Puntitos pequeños de luz
        opacity: Math.random(),
        fadeSpeed: Math.random() * 0.02 + 0.01,
        // Algunos blancos, otros azul muy clarito
        color: Math.random() > 0.5 ? "255, 255, 255" : "200, 230, 255" 
      };
    };

    // Inicializar corazones y destellos
    for (let i = 0; i < 30; i++) hearts.push(createHeart(true));
    for (let i = 0; i < 60; i++) sparkles.push(createSparkle());

    const drawHeart = (heart) => {
      ctx.save();
      ctx.translate(heart.x + Math.sin(heart.angle) * 15, heart.y);
      
      // Efecto Glow (Brillo Neón exterior) en lugar de desenfoque
      ctx.shadowBlur = heart.size * 0.4;
      ctx.shadowColor = `rgba(${heart.color}, ${heart.opacity})`;
      
      // Gradiente interno para que el corazón tenga volumen y luz propia
      const gradient = ctx.createRadialGradient(0, -heart.size/4, 0, 0, 0, heart.size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${heart.opacity * 0.8})`); // Centro de luz blanco
      gradient.addColorStop(0.4, `rgba(${heart.color}, ${heart.opacity})`); // Color intenso
      gradient.addColorStop(0.9, `rgba(${heart.color}, ${heart.opacity * 0.9})`); // Bordes bien definidos
      
      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-heart.size / 2, -heart.size / 2, -heart.size, heart.size / 3, 0, heart.size);
      ctx.bezierCurveTo(heart.size, heart.size / 3, heart.size / 2, -heart.size / 2, 0, 0);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const drawSparkles = () => {
      sparkles.forEach((sparkle) => {
        // Efecto de titilar (parpadeo de luz)
        sparkle.opacity += sparkle.fadeSpeed;
        if (sparkle.opacity >= 1 || sparkle.opacity <= 0) {
          sparkle.fadeSpeed *= -1; // Invierte el desvanecimiento
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sparkle.color}, ${sparkle.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${sparkle.color}, ${sparkle.opacity})`;
        ctx.fill();
        ctx.restore();
      });
    };

    const animate = () => {
      // Fondo negro
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar destellos en el fondo
      drawSparkles();

      // Modo de luz para que los corazones brillen al tocarse
      ctx.globalCompositeOperation = "screen";

      hearts = hearts.map((heart) => {
        const nextY = heart.y - heart.speed;
        const nextAngle = heart.angle + heart.wobbleSpeed;

        if (nextY < -heart.size * 2) {
          return createHeart(false);
        }

        const updatedHeart = { ...heart, y: nextY, angle: nextAngle };
        drawHeart(updatedHeart);
        return updatedHeart;
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" 
    />
  );
};

export default ParticleBackground;