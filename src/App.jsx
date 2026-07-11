import { useState } from "react";
import { STEPS } from "./data/steps";
import ParticleBackground from "./components/ParticleBackground";
import TextStep from "./components/TextStep";
import QuestionStep from "./components/QuestionStep";
import NextButton from "./components/NextButton";
import DinnerTicket from "./components/DinnerTicket";

const App = () => {
  const [current_step, set_current_step] = useState(0);
  const [showIntermediateText, setShowIntermediateText] = useState(false);
  const [is_accepted, set_is_accepted] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handle_next = () => {
    if (current_step < STEPS.length - 1) {
      set_current_step((prev) => prev + 1);
    }
  };

  const handle_accept = () => {
    setShowIntermediateText(true);
    setTimeout(() => {
      setShowIntermediateText(false);
      set_is_accepted(true);
    }, 3000);
  };

  const handle_download_complete = () => {
    setIsDownloaded(true);
  };

  const step_data = STEPS[current_step];

  const render_content = () => {
    if (isDownloaded) {
      return (
        <div className="flex flex-col items-center justify-center text-center z-10 text-white max-w-md px-4">
          <h1 className="text-3xl font-black text-red-500 mb-6 animate-pulse">
            Gracias por aceptar bb, te bañas 🕷️❤️
          </h1>
          <div className="rounded-2xl overflow-hidden border-2 border-blue-500 shadow-2xl max-w-[320px]">
            <video 
              src="/images/final.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      );
    }

    if (showIntermediateText) {
      return (
        <div className="flex flex-col items-center justify-center text-center z-10 text-white">
          <h1 className="text-4xl font-black text-red-500 animate-bounce">
            Yo sabía que sí querías 🥱🥱
          </h1>
        </div>
      );
    }

    if (is_accepted) {
      return <DinnerTicket onDownloadComplete={handle_download_complete} />;
    }

    switch (step_data.type) {
      case "question":
        return <QuestionStep data={step_data} onAccept={handle_accept} />;
      default:
        return <TextStep data={step_data} />;
    }
  };

  return (
    /* Aquí quitamos el bg-[#000000] y pusimos bg-transparent para dejar ver el canvas */
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {render_content()}

      {!is_accepted && !showIntermediateText && !isDownloaded && step_data.type !== "question" && (
        <div className="fixed bottom-12 z-50">
          <NextButton onClick={handle_next} className="animate-bounce" />
        </div>
      )}

      <ParticleBackground />
    </div>
  );
};

export default App;