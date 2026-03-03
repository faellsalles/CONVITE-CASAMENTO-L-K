import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { MapPin, Info, X, MessageCircle } from 'lucide-react';

const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showGravata, setShowGravata] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const targetDate = new Date('2026-07-11T19:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  const handleScreenClick = (e: React.MouseEvent) => {
    // If clicking the background or the envelope (not the card or button)
    if (!isOpen && !isRedirecting) {
      setIsOpen(true);
    }
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfxdOC87vU3j8hRV0aVteA9hOjhRda_U5dp6Quecd2iHXq2uA/viewform?usp=header';
    }, 1000);
  };

  // Animation variants
  const envelopeVariants = {
    closed: { y: [0, -10, 0], scale: 1, opacity: 1 },
    open: { y: 300, scale: 1, opacity: 1 }, // Moved down more to give space at top
    redirecting: { y: 600, opacity: 0, scale: 0.9, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  const cardVariants = {
    closed: { y: 0, scale: 1, opacity: 0, zIndex: 10 },
    open: { y: -400, scale: 1.02, opacity: 1, zIndex: 60 } // Increased upward travel to show full card
  };

  const flapVariants = {
    closed: { rotateX: 0, zIndex: 30 },
    open: { rotateX: 180, zIndex: 0 }
  };

  const sealVariants = {
    closed: { opacity: 1, scale: 1 },
    open: { opacity: 0, scale: 0.5 }
  };

  const hintVariants = {
    closed: { opacity: 1, y: 0 },
    open: { opacity: 0, y: -10 }
  };

  const transitionOpen = { duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] };
  const transitionFlap = { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" };
  const transitionBreathing = { repeat: Infinity, duration: 4, ease: "easeInOut" };

  return (
    <div 
      className="min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden relative cursor-pointer p-4"
      style={{ backgroundColor: '#F5F2EB' }}
      onClick={handleScreenClick}
    >
      {/* Global Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: noiseTexture }}
      />

      <motion.div 
        className="relative w-[90%] max-w-[340px] h-[240px] z-10"
        variants={envelopeVariants}
        initial="closed"
        animate={isRedirecting ? "redirecting" : isOpen ? "open" : "closed"}
        transition={isOpen && !isRedirecting ? transitionOpen : isRedirecting ? {} : { y: transitionBreathing }}
      >
        {/* Hint Text */}
        <motion.div
          className="absolute -top-12 left-0 w-full text-center text-[#8E3B29] font-sans text-xs tracking-widest uppercase pointer-events-none"
          variants={hintVariants}
          transition={{ duration: 0.3 }}
        >
          Toque para abrir
        </motion.div>

        {/* Envelope Back */}
        <div className="absolute inset-0 bg-[#C26B51] rounded-md shadow-2xl overflow-hidden">
          {/* Subtle texture on envelope */}
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseTexture }} />
        </div>

        {/* Card Container */}
        <div 
          className={`absolute inset-0 ${isOpen ? 'z-50' : 'z-10'} pointer-events-none`}
          style={{ clipPath: isOpen ? 'none' : 'inset(-100% 0 0 0)' }}
        >
          <motion.div 
            className={`absolute top-2 left-2 right-2 h-[460px] bg-[#FDFBF7] rounded-md shadow-2xl p-1 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            variants={cardVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ ...transitionOpen, delay: isOpen && !shouldReduceMotion ? 0.2 : 0 }}
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex flex-col items-center justify-between h-full w-full border border-[#E8E3D9] p-3 pb-5 rounded-sm relative overflow-hidden">
              {/* Subtle texture on card */}
              <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none" style={{ backgroundImage: noiseTexture }} />
              
              {/* Content */}
              <div className="mt-1 text-center z-10">
                <p className="font-serif text-[10px] sm:text-[11px] text-[#7A6A63] leading-relaxed px-2">
                  Com a benção de seus pais, Valdirene e Carlos,<br/>
                  Maria e Divino<br/><br/>
                  Convidam você para a celebração do casamento de seus filhos,<br/>
                  Luiz Otávio & Ketlyn.
                </p>
              </div>

              <div className="my-1 z-10">
                <h1 className="font-elegant text-4xl sm:text-5xl text-[#4A3B32] tracking-[0.2em] flex items-center gap-3">
                  L <span className="text-xl sm:text-2xl text-[#C26B51] font-light">&</span> K
                </h1>
              </div>

              <div className="mb-2 flex flex-col items-center z-10">
                <p className="font-serif text-2xl sm:text-3xl text-[#4A3B32] tracking-widest">11.07.26</p>
                <div className="w-8 h-[1px] bg-[#D4AF37] my-1 opacity-50"></div>
                <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.3em] text-[#7A6A63]">19H</p>
                
                {/* Countdown */}
                <div className="mt-1.5 flex flex-col items-center">
                  <p className="font-serif text-lg sm:text-xl text-[#C26B51]">{daysLeft}</p>
                  <p className="font-sans text-[6px] sm:text-[7px] uppercase tracking-[0.2em] text-[#9A8A83]">Dias Restantes</p>
                </div>
              </div>

              {/* Icons Section */}
              <div className="flex items-center gap-4 mb-3 z-10">
                <a 
                  href="https://share.google/BZi0YDlhTYXyThAGf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-9 h-9 rounded-full border border-[#E8E3D9] flex items-center justify-center text-[#C26B51] group-hover:bg-[#C26B51] group-hover:text-white transition-colors shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <span className="font-sans text-[6px] uppercase tracking-widest text-[#9A8A83]">Local</span>
                </a>

                <a 
                  href="https://chat.whatsapp.com/G27ZgiP20bRIhDhyfY0Wxe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-9 h-9 rounded-full border border-[#E8E3D9] flex items-center justify-center text-[#C26B51] group-hover:bg-[#C26B51] group-hover:text-white transition-colors shadow-sm">
                    <MessageCircle size={16} />
                  </div>
                  <span className="font-sans text-[6px] uppercase tracking-widest text-[#9A8A83]">Avisos</span>
                </a>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGravata(true);
                  }}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-9 h-9 rounded-full border border-[#E8E3D9] flex items-center justify-center text-[#C26B51] group-hover:bg-[#C26B51] group-hover:text-white transition-colors shadow-sm">
                    <Info size={16} />
                  </div>
                  <span className="font-sans text-[6px] uppercase tracking-widest text-[#9A8A83]">Gravata</span>
                </button>
              </div>

              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfxdOC87vU3j8hRV0aVteA9hOjhRda_U5dp6Quecd2iHXq2uA/viewform?usp=header" 
                onClick={handleConfirmClick}
                className="z-10 bg-[#8E3B29] text-[#FDFBF7] font-sans text-[9px] uppercase tracking-[0.2em] py-2.5 px-7 rounded-full shadow-sm hover:bg-[#7A3020] hover:shadow-md transition-all active:scale-95 w-full max-w-[200px] text-center"
              >
                Confirmar Presença
              </a>
              
              <div className="h-0.5" />
            </div>
          </motion.div>
        </div>

        {/* Envelope Front Flaps */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ filter: 'drop-shadow(0 -4px 6px rgba(0,0,0,0.1))' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Left flap */}
            <polygon points="0,0 45,55 0,100" fill="#B85D43" />
            <polyline points="0,0 45,55 0,100" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
            
            {/* Right flap */}
            <polygon points="100,0 55,55 100,100" fill="#B85D43" />
            <polyline points="100,0 55,55 100,100" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
            
            {/* Bottom flap */}
            <polygon points="0,100 50,45 100,100" fill="#A64B33" />
            <polyline points="0,100 50,45 100,100" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
          </svg>
          {/* Subtle texture on front flaps */}
          <div 
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" 
            style={{ 
              backgroundImage: noiseTexture, 
              clipPath: 'polygon(0 0, 45% 55%, 50% 45%, 55% 55%, 100% 0, 100% 100%, 0 100%)' 
            }} 
          />
        </div>

        {/* Envelope Top Flap */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-[60%] origin-top pointer-events-none"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
          variants={flapVariants}
          transition={transitionFlap}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <polygon points="0,0 100,0 50,100" fill="#C26B51" />
            <polyline points="0,0 50,100 100,0" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
          </svg>
          {/* Subtle texture on top flap */}
          <div 
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" 
            style={{ 
              backgroundImage: noiseTexture, 
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)' 
            }} 
          />
        </motion.div>

        {/* Wax Seal */}
        <motion.div 
          className="absolute left-1/2 top-[60%] w-14 h-14 -ml-7 -mt-7 bg-[#D4AF37] rounded-full shadow-md flex items-center justify-center z-40 pointer-events-none"
          variants={sealVariants}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 border border-[#B8962E] rounded-full flex items-center justify-center bg-[#C9A32E]">
            <span className="text-[#8A6D1A] font-elegant text-lg tracking-wider pr-0.5">L&K</span>
          </div>
        </motion.div>

      </motion.div>

      {/* Gravata Modal */}
      <AnimatePresence>
        {showGravata && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowGravata(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FDFBF7] w-full max-w-[320px] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none" style={{ backgroundImage: noiseTexture }} />
              
              <button 
                onClick={() => setShowGravata(false)}
                className="absolute top-4 right-4 text-[#9A8A83] hover:text-[#4A3B32] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#C26B51] mb-4">
                  <Info size={24} />
                </div>
                
                <h3 className="font-serif text-xl text-[#4A3B32] mb-3 tracking-wide">Momento da Gravata</h3>
                
                <p className="font-sans text-[11px] text-[#7A6A63] leading-relaxed mb-4 text-justify">
                  Sua presença é muito importante para nós! Não queremos que nada impeça você de estar conosco no dia mais especial de nossas vidas; prepare-se para viver o extraordinário que o Senhor reservou para nós!<br/><br/>
                  Durante a festa, teremos o tradicional 'Momento da Gravata', uma brincadeira simbólica para nos ajudar na nossa Lua de Mel. Gostaríamos que você se sentisse à vontade para participar apenas se desejar e com o valor que o seu coração sentir, sem qualquer obrigação. O mais importante é celebrarmos juntos!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 w-full flex flex-col items-center justify-center gap-2 z-50">
        <p className={`font-sans text-[10px] uppercase tracking-widest transition-colors duration-500 ${isOpen ? 'text-white/90' : 'text-[#7A6A63]'}`}>
          Feito com ❤️ por
        </p>
        <a 
          href="https://www.instagram.com/venttuscompany/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="transition-transform hover:scale-110 active:scale-95 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {!logoError ? (
            <img 
              src="https://raw.githubusercontent.com/VenttusCompany/assets/main/logo-venttus.png" 
              alt="Venttus Company" 
              className={`h-6 transition-all duration-500 ${isOpen ? 'brightness-0 invert opacity-90' : 'opacity-80'}`}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className={`font-bold text-[14px] tracking-[2px] transition-colors duration-500 ${isOpen ? 'text-white' : 'text-[#4A3B32]'}`}>
              VENTTUS COMPANY
            </span>
          )}
        </a>
      </footer>
    </div>
  );
}
