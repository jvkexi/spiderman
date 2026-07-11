import { useRef } from "react";
import domToImage from "dom-to-image";
import { UI_TEXTS } from "../data/steps";

const DinnerTicket = ({ onDownloadComplete }) => {
  const ticketRef = useRef(null);
  const { emoji, title, prize, valid_for, recipient, footer } = UI_TEXTS.dinner_ticket;

  const downloadTicket = () => {
    if (!ticketRef.current) return;

    // dom-to-image necesita un microsegundo para procesar los nodos del DOM
    setTimeout(() => {
      domToImage
        .toPng(ticketRef.current, {
          quality: 1.0,
          bgcolor: "#000000", // Asegura que el fondo del PNG sea negro absoluto
        })
        .then((dataUrl) => {
          // Crear la descarga física nativa
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "cupon-spiderman-completo.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Avanza de inmediato a la bonita pantalla final con el video en loop
          if (onDownloadComplete) {
            onDownloadComplete();
          }
        })
        .catch((error) => {
          console.error("Error al exportar el cupón con dom-to-image:", error);
          // Si por alguna razón extrema del navegador falla, forzamos el avance para no arruinar la experiencia
          if (onDownloadComplete) onDownloadComplete();
        });
    }, 150);
  };

  return (
    <div className="flex flex-col items-center justify-center z-10 w-full max-w-md px-4 text-white select-none">
      
      {/* Contenedor del Cupón Completo (Captura exacta desde el borde rojo punteado) */}
      <div 
        ref={ticketRef}
        className="bg-black border-4 border-dashed border-red-600 rounded-2xl p-6 shadow-2xl relative w-full text-center overflow-hidden"
        style={{ boxSizing: "border-box" }}
      >
        {/* Círculos decorativos laterales */}
        <div className="absolute -left-4 top-1/2 w-8 h-8 bg-neutral-900 rounded-full transform -translate-y-1/2 border-r border-dashed border-red-600"></div>
        <div className="absolute -right-4 top-1/2 w-8 h-8 bg-neutral-900 rounded-full transform -translate-y-1/2 border-l border-dashed border-red-600"></div>

        {/* Stickers / GIFs de Spider-Man laterales */}
        <div className="absolute left-1 top-[45%] -translate-y-1/2 w-14 h-14 pointer-events-none z-20">
          <img src="/images/sticker1.gif" alt="Spidey L" className="w-full h-full object-contain" />
        </div>
        <div className="absolute right-1 top-[45%] -translate-y-1/2 w-14 h-14 pointer-events-none z-20">
          <img src="/images/sticker2.gif" alt="Spidey R" className="w-full h-full object-contain" />
        </div>

        {/* Estructura Interna del Ticket */}
        <div className="border border-neutral-900 p-5 rounded-xl bg-neutral-950/80 backdrop-blur-sm">
          <div className="text-3xl mb-1">{emoji}</div>
          
          <h2 className="text-xs font-black tracking-[0.25em] text-blue-500 uppercase">
            {title}
          </h2>
          
          <h1 className="text-4xl font-extrabold text-red-500 uppercase tracking-tighter mt-1 mb-3">
            {prize}
          </h1>

          {/* Póster de la Película */}
          <div className="w-44 h-60 mx-auto rounded-lg overflow-hidden border border-neutral-900 shadow-xl my-4 bg-black">
            <img 
              src="/images/poster.jpg" 
              alt="Spider-Man" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="border-t border-b border-neutral-900 py-3 my-3">
            <p className="text-neutral-600 uppercase text-[10px] tracking-widest mb-1">
              {valid_for}
            </p>
            <p className="text-lg font-semibold text-neutral-200 italic">
              {recipient}
            </p>
          </div>

          {/* Términos */}
          <p className="text-[10px] text-neutral-500 leading-relaxed font-medium px-4">
            *{footer}
          </p>
        </div>
      </div>

      {/* Botón de Control externo */}
      <button
        onClick={downloadTicket}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg px-8 py-3 rounded-full shadow-lg transform active:scale-95 transition duration-150 cursor-pointer border border-blue-400 z-30"
      >
        Descargar Cupón 🎟️
      </button>
    </div>
  );
};

export default DinnerTicket;