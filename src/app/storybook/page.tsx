'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Volume2, Sparkles, Loader2, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORY_SCENES = [
  { 
    id: 1, 
    text: "In a magical forest, lived a tiny and brave", 
    expectedWord: "Dog", 
    emoji: "🐶", 
    color: "from-emerald-400 to-green-600",
    bgDeco: "🌳🌿🍄"
  },
  { 
    id: 2, 
    text: "He was very hungry and found a big, red", 
    expectedWord: "Apple", 
    emoji: "🍎", 
    color: "from-rose-400 to-red-600",
    bgDeco: "🍎🍃🍎"
  },
  { 
    id: 3, 
    text: "When night came, he looked up and saw a shiny", 
    expectedWord: "Star", 
    emoji: "⭐", 
    color: "from-indigo-400 to-purple-600",
    bgDeco: "✨🌙☁️"
  },
  { 
    id: 4, 
    text: "He felt thirsty and drank some cool, fresh", 
    expectedWord: "Water", 
    emoji: "💧", 
    color: "from-cyan-400 to-blue-600",
    bgDeco: "🌊🐟🐚"
  },
];

export default function Storybook() {
  const worker = useRef<Worker | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const audioBuffer = useRef<Float32Array>(new Float32Array(0));
  
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState('Opening the Magic Book...');
  const [isRecording, setIsRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [heardText, setHeardText] = useState('');
  
  const currentScene = STORY_SCENES[currentIndex];
  const currentSceneRef = useRef(STORY_SCENES[0]);

  useEffect(() => {
    currentSceneRef.current = currentScene;
  }, [currentScene]);

  const readStory = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; 
      utterance.pitch = 1.1; 
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
    osc.frequency.setValueAtTime(523.25, actx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, actx.currentTime + 0.3); // C6
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
        setTimeout(() => readStory(STORY_SCENES[0].text), 800); 
      }
      else if (status === 'decoding') setIsDecoding(true);
      else if (status === 'complete') {
        setIsDecoding(false);
        setHeardText(text);
        
        const cleanText = text.trim().replace(/[^\w\s]/gi, '').toLowerCase();
        // Check if the expected word is found in the transcribed text
        if (cleanText.includes(currentSceneRef.current.expectedWord.toLowerCase())) {
          setIsMatch(true);
          playSuccessSound();
          // Automatically read the completed sentence
          setTimeout(() => readStory(currentSceneRef.current.expectedWord), 500);
        } else {
          setIsMatch(false);
        }
      } else if (status === 'error') {
        setIsDecoding(false);
        console.error("AI Error:", error);
      }
    };
    
    worker.current.postMessage({ type: 'load' });
    return () => {
      worker.current?.terminate();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
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
      alert('We need microphone access to hear the magic words!');
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
      expectedWord: currentSceneRef.current.expectedWord 
    });
  };

  const nextScene = () => {
    if (currentIndex === STORY_SCENES.length - 1) {
      // Reached the end, maybe reset or show end screen. For MVP, loop to 0.
      setIsMatch(null);
      setHeardText('');
      setCurrentIndex(0);
      readStory(STORY_SCENES[0].text);
      return;
    }
    
    setIsMatch(null);
    setHeardText('');
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    readStory(STORY_SCENES[nextIdx].text);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-slate-900 select-none">
      
      {/* Dynamic Background matching the story theme */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br ${currentScene.color} opacity-20 transition-colors duration-1000`} />
      
      {/* Animated blurry blobs for immersion */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 30, -30, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-white/10 mix-blend-screen blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-white/10 mix-blend-screen blur-[100px]"
        />
      </div>

      {/* TOP BAR */}
      <div className="absolute top-0 w-full p-6 sm:p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
             <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-black text-xl tracking-wide shadow-black/50 drop-shadow-md">VOXIE TALES</span>
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
              Story Engine Active
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        
        {/* Progress Dots */}
        <div className="flex items-center gap-2 mb-8">
          {STORY_SCENES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-white' : idx < currentIndex ? 'w-2 bg-white/50' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Story Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            {/* Story Text Box */}
            <div 
              className="bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 p-8 sm:p-12 w-full text-center shadow-2xl relative overflow-hidden group cursor-pointer"
              onClick={() => readStory(currentScene.text)}
            >
              <div className="absolute top-4 right-6 text-white/30 group-hover:text-white/60 transition-colors">
                <Volume2 className="w-6 h-6" />
              </div>
              
              <div className="text-white/20 text-4xl sm:text-6xl absolute -top-4 -left-4 pointer-events-none select-none font-serif">
                &quot;
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight sm:leading-tight drop-shadow-lg">
                {currentScene.text}{" "}
                <span className={`inline-block border-b-4 border-dashed transition-all duration-300 ${isMatch ? 'border-transparent' : 'border-white/40 min-w-[3em]'}`}>
                  {isMatch ? (
                    <span className="text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]">
                      {currentScene.expectedWord}
                    </span>
                  ) : (
                    <span className="text-white/0">{currentScene.expectedWord}</span>
                  )}
                </span>
                !
              </h2>

              {/* Decorative Emoji background hinting at the scene */}
              <div className="absolute -bottom-8 -right-4 text-7xl sm:text-9xl opacity-20 pointer-events-none select-none mix-blend-overlay">
                {currentScene.bgDeco}
              </div>
            </div>

            {/* Illustration / Visual Focus */}
            <div className="mt-12 mb-8 relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Magic Circle */}
              <div className={`absolute inset-0 rounded-full border-2 border-white/10 border-dashed animate-[spin_20s_linear_infinite]`} />
              <div className={`absolute inset-4 rounded-full border border-white/20 animate-[spin_15s_linear_infinite_reverse]`} />
              
              <motion.div 
                animate={isMatch ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : { y: [0, -10, 0] }}
                transition={isMatch ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl sm:text-[8rem] drop-shadow-2xl z-10"
              >
                {currentScene.emoji}
              </motion.div>

              <AnimatePresence>
                {isMatch && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [1, 2, 3], opacity: [1, 0, 0] }}
                    transition={{ duration: 1 }}
                    className={`absolute inset-0 bg-white rounded-full mix-blend-screen blur-md`}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* STATUS & FEEDBACK */}
        <div className="h-12 w-full flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {isMatch === true && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-emerald-300 font-bold text-xl drop-shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" /> Story Unlocked!
              </motion.div>
            )}
            {isMatch === false && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-rose-300 font-bold text-lg drop-shadow-md"
              >
                I heard: <span className="text-white">&quot;{heardText}&quot;</span>. Try again!
              </motion.div>
            )}
            {isDecoding && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-white/80 font-bold text-lg flex items-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" /> LISTENING...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-6 mt-6 w-full justify-center pb-12">
          {/* Spacer */}
          <div className="w-16 hidden sm:block" />

          {/* SQUISHY MICROPHONE BUTTON */}
          <motion.button
            disabled={!isReady || isDecoding || isMatch === true}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            whileTap={{ scale: 0.85 }}
            className={`relative group w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center rounded-full transition-all duration-300 z-20 ${
              isRecording 
                ? 'bg-gradient-to-b from-orange-400 to-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.6)] border-4 border-white' 
                : !isReady || isDecoding || isMatch === true
                  ? 'bg-white/10 backdrop-blur-md cursor-not-allowed border-2 border-white/10 text-white/30'
                  : 'bg-white text-black hover:bg-slate-100 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1'
            }`}
          >
            {isRecording && (
              <span className="absolute inset-[-8px] rounded-full border-[2px] border-orange-300/50 animate-ping"></span>
            )}
            <Mic className={`w-8 h-8 sm:w-10 sm:h-10 mb-1 ${isRecording ? 'text-white' : 'text-slate-800'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isRecording ? 'text-white' : 'text-slate-600'}`}>
              Speak
            </span>
          </motion.button>

          {/* NEXT SCENE BUTTON - Only highlighted when matched */}
          <AnimatePresence>
            {isMatch === true && (
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={nextScene}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.5)] border-2 border-white"
              >
                <ArrowRight className="w-8 h-8" />
              </motion.button>
            )}
          </AnimatePresence>
          
          {isMatch !== true && (
            <div className="w-16 hidden sm:block" />
          )}
        </div>

      </div>
    </div>
  );
}
