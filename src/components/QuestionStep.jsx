import { useState } from "react";

const QuestionStep = ({ data, onAccept }) => {
  const [noButtonPos, setNoButtonPos] = useState(null);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [isNoVisible, setIsNoVisible] = useState(true);

  const handleDodgeNo = () => {
    // Si ya esquivó los clics/toques 4 veces anteriores (el quinto intento), desaparece
    if (dodgeCount >= 4) {
      setIsNoVisible(false);
      return;
    }

    // Definir un margen para que el botón no salte fuera de los bordes visibles de la pantalla
    const padding = 100;
    const randomX = Math.random() * (window.innerWidth - padding * 2) + padding;
    const randomY = Math.random() * (window.innerHeight - padding * 2) + padding;

    setNoButtonPos({ x: randomX, y: randomY });
    setDodgeCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-lg px-4 z-10 text-white select-none">
      {/* Título de la pregunta */}
      <h2 className="text-3xl font-extrabold mb-4 text-red-500 animate-pulse">
        {data.title}
      </h2>
      
      {/* Texto de la propuesta */}
      <p className="text-xl font-medium mb-8 bg-black/50 p-5 rounded-2xl backdrop-blur-sm border border-neutral-800 shadow-xl leading-relaxed">
        {data.content}
      </p>

      {/* Contenedor de los botones de interacción */}
      <div className="flex items-center justify-center gap-8 min-h-[60px] w-full relative">
        {/* Botón SÍ */}
        <button
          onClick={onAccept}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xl px-8 py-3 rounded-full shadow-lg transform hover:scale-110 active:scale-95 transition duration-200 z-10 cursor-pointer border border-red-400"
        >
          POR SUPUESTO QUE SIII ❤️
        </button>

        {/* Botón NO con eventos para computadora (onMouseEnter) y celular (onTouchStart) */}
        {isNoVisible && (
          <button
            onMouseEnter={handleDodgeNo}
            onTouchStart={(e) => {
              e.preventDefault(); // Evita el comportamiento de clic fantasma en móviles
              handleDodgeNo();
            }}
            onClick={handleDodgeNo}
            style={
              noButtonPos
                ? {
                    position: "fixed",
                    left: `${noButtonPos.x}px`,
                    top: `${noButtonPos.y}px`,
                    transition: "all 0.15s ease-out",
                  }
                : {}
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl px-8 py-3 rounded-full shadow-lg z-50 cursor-pointer border border-blue-400 transition-colors"
          >
            NOOO 🥺
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionStep;