'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Volume2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CARDS = [
  { word: 'Dog', spelling: 'd-o-g', emoji: '🐶', theme: 'from-emerald-300 to-teal-500', shadow: 'shadow-teal-500/50' },
  { word: 'Apple', spelling: 'a-p-p-l-e', emoji: '🍎', theme: 'from-rose-400 to-red-500', shadow: 'shadow-rose-500/50' },
  { word: 'Star', spelling: 's-t-a-r', emoji: '⭐', theme: 'from-amber-300 to-orange-500', shadow: 'shadow-amber-500/50' },
  { word: 'Water', spelling: 'w-a-t-e-r', emoji: '💧', theme: 'from-cyan-400 to-blue-600', shadow: 'shadow-blue-500/50' },
];

export default function MagicCards() {
  const worker = useRef<Worker | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const audioBuffer = useRef<Float32Array>(new Float32Array(0));
  
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState('Initializing AI Core...');
  const [isRecording, setIsRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [heardText, setHeardText] = useState('');
  
  const currentCard = CARDS[currentIndex];
  const currentCardRef = useRef(CARDS[0]);

  // Sync ref so the worker closure always sees the latest card
  useEffect(() => {
    currentCardRef.current = currentCard;
  }, [currentCard]);

  const playWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; 
      utterance.pitch = 1.2; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSuccessSound = () => {
    const actx = new window.AudioContext();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, actx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(1046.50, actx.currentTime + 0.3); 
    gain.gain.setValueAtTime(0.5, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.5);
    osc.start();
    osc.stop(actx.currentTime + 0.5);
  };

  useEffect(() => {
    worker.current = new Worker(new URL('../../lib/worker.ts', import.meta.url), {
      type: 'module'
    });
    
    worker.current.onmessage = (e) => {
      const { status, data, text, error } = e.data;
      if (status === 'progress') {
        if (data.isFromCache) {
          setProgress(`Waking AI from Cache: ${Math.round((data.progress || 0))}%`);
        } else {
          setProgress(`Downloading AI: ${Math.round((data.progress || 0))}%`);
        }
      }
      else if (status === 'ready') {
        setIsReady(true);
        setTimeout(() => playWord(CARDS[0].word), 800); 
      }
      else if (status === 'decoding') setIsDecoding(true);
      else if (status === 'complete') {
        setIsDecoding(false);
        setHeardText(text);
        
        const cleanText = text.trim().replace(/[^\w\s]/gi, '').toLowerCase();
        if (cleanText.includes(currentCardRef.current.word.toLowerCase())) {
          setIsMatch(true);
          playSuccessSound();
        } else {
          setIsMatch(false);
        }
      } else if (status === 'error') {
        setIsDecoding(false);
        console.error("AI Error:", error);
      }
    };
    
    worker.current.postMessage({ type: 'load' });
    return () => worker.current?.terminate();
  }, []);

  const startRecording = async () => {
    try {
      audioBuffer.current = new Float32Array(0);
      setIsMatch(null);
      setHeardText('');
      
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new window.AudioContext({ sampleRate: 16000 });
      
      const source = audioContext.current.createMediaStreamSource(mediaStream.current);
      processor.current = audioContext.current.createScriptProcessor(4096, 1, 1);
      
      processor.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const newBuffer = new Float32Array(audioBuffer.current.length + inputData.length);
        newBuffer.set(audioBuffer.current);
        newBuffer.set(inputData, audioBuffer.current.length);
        audioBuffer.current = newBuffer;
      };
      
      source.connect(processor.current);
      processor.current.connect(audioContext.current.destination);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Microphone access is needed for the magic to work!');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (processor.current && audioContext.current) {
      processor.current.disconnect();
      audioContext.current.close();
    }
    if (mediaStream.current) mediaStream.current.getTracks().forEach(t => t.stop());
    
    worker.current?.postMessage({
      type: 'transcribe',
      audio: audioBuffer.current,
      expectedWord: currentCardRef.current.word 
    });
  };

  const nextCard = () => {
    setIsMatch(null);
    setHeardText('');
    const nextIdx = (currentIndex + 1) % CARDS.length;
    setCurrentIndex(nextIdx);
    playWord(CARDS[nextIdx].word);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-slate-900 select-none">
      
      {/* --- FLUID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-teal-500/40 mix-blend-screen blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-indigo-500/30 mix-blend-screen blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, 40, -40, 0], y: [0, 40, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[10%] w-[60vw] h-[60vw] rounded-full bg-rose-500/30 mix-blend-screen blur-[120px]"
        />
      </div>

      {/* --- TOP BAR --- */}
      <div className="absolute top-0 w-full p-6 sm:p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
             <span className="text-xl">🦊</span>
          </div>
          <span className="text-white font-black text-xl tracking-wide shadow-black/50 drop-shadow-md">VOXIE KIDS</span>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow-lg">
          {!isReady ? (
            <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider">
              <Loader2 className="w-4 h-4 animate-spin text-teal-300"/> {progress}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI Core Active
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
        
        {/* --- MAIN FLASHCARD --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.9, rotateX: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="w-full aspect-[4/5] max-w-[320px] mx-auto relative group perspective-[1000px] cursor-pointer"
            onClick={() => playWord(currentCard.word)}
          >
            {/* Outer Glass Container */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] border-[1.5px] border-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Inner Card (Colored) */}
              <div className="absolute inset-[12px] rounded-[2rem] bg-gradient-to-b from-white/95 to-white/90 shadow-inner flex flex-col items-center pt-10 pb-8 overflow-hidden">
                
                {/* Background glow matching theme */}
                <div className={`absolute -top-20 w-64 h-64 rounded-full bg-gradient-to-br ${currentCard.theme} opacity-20 blur-3xl`} />

                <h1 className="text-[#1a2b4b] text-5xl font-black tracking-tight z-10">{currentCard.word.toUpperCase()}</h1>
                <p className="text-slate-400 font-bold tracking-[0.3em] uppercase mt-2 z-10">{currentCard.spelling}</p>
                
                {/* Visual Representation (Emoji/3D Icon placeholder) */}
                <motion.div 
                  className="flex-1 w-full flex items-center justify-center z-10 mt-2"
                  animate={isMatch ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-[9rem] drop-shadow-2xl">{currentCard.emoji}</span>
                </motion.div>

                {/* Confetti Overlay on Success */}
                <AnimatePresence>
                  {isMatch && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 2 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-br ${currentCard.theme} mix-blend-screen opacity-50 z-20 pointer-events-none`}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Top Right Speaker Icon */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-slate-500 z-30 shadow-sm border border-black/5">
                <Volume2 className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- STATUS TEXT --- */}
        <div className="h-16 mt-8 w-full flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {isMatch === true && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-emerald-300 font-black text-2xl drop-shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-300" /> PERFECT!
              </motion.div>
            )}
            {isMatch === false && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-rose-300 font-bold text-lg drop-shadow-md"
              >
                I heard: <span className="text-white">&quot;{heardText}&quot;</span><br/>
                <span className="text-rose-200/70 text-sm">Let&apos;s try again!</span>
              </motion.div>
            )}
            {isDecoding && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-white/80 font-bold text-lg flex items-center gap-2 tracking-wide"
              >
                <Loader2 className="w-5 h-5 animate-spin" /> LISTENING...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex items-center gap-6 mt-2 relative w-full justify-center">
          <div className="w-14" /> {/* Visual Balance Spacer */}

          {/* SQUISHY MICROPHONE BUTTON */}
          <motion.button
            disabled={!isReady || isDecoding}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            whileTap={{ scale: 0.85 }}
            className={`relative group w-32 h-32 sm:w-36 sm:h-36 flex flex-col items-center justify-center rounded-full border-[3px] border-white/40 transition-all duration-300 z-20 ${
              isRecording 
                ? 'bg-gradient-to-b from-orange-400 to-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.6)]' 
                : !isReady || isDecoding
                  ? 'bg-white/10 backdrop-blur-md cursor-not-allowed border-white/10 text-white/30'
                  : 'bg-gradient-to-b from-orange-300 to-rose-400 shadow-[0_20px_40px_-10px_rgba(244,63,94,0.5)] hover:shadow-[0_25px_50px_-10px_rgba(244,63,94,0.6)] hover:-translate-y-1 text-white'
            }`}
          >
            {/* Glow Ring when active */}
            {isRecording && (
              <span className="absolute inset-[-10px] rounded-full border-[2px] border-orange-300/50 animate-ping"></span>
            )}
            
            <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
            
            <Mic className={`w-10 h-10 sm:w-12 sm:h-12 mb-1 drop-shadow-md ${isRecording ? 'scale-110 text-white' : ''} transition-transform`} />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/90 drop-shadow-sm">
              Tap & Say
            </span>
            <span className="text-sm sm:text-base font-black tracking-wider text-white drop-shadow-md leading-none">
              &quot;{currentCard.word.toUpperCase()}&quot;
            </span>
          </motion.button>

          {/* NEXT BUTTON */}
          <button 
            onClick={nextCard}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
