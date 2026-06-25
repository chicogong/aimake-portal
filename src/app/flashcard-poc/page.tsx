'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FlashcardPoC() {
  const worker = useRef<Worker | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [result, setResult] = useState<string>('');
  const [progress, setProgress] = useState<string>('Initializing local AI (Whisper-tiny)...');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  
  const targetWord = 'Apple';
  const audioBuffer = useRef<Float32Array>(new Float32Array(0));

  useEffect(() => {
    // Initialize Web Worker
    worker.current = new Worker(new URL('../../lib/worker.ts', import.meta.url), {
      type: 'module'
    });
    
    worker.current.onmessage = (e) => {
      const { status, data, text, error } = e.data;
      
      if (status === 'progress') {
        setProgress(`Loading Model: ${Math.round((data.progress || 0))}%`);
      } else if (status === 'ready') {
        setIsReady(true);
        setProgress('Model Ready! 100% Offline.');
      } else if (status === 'decoding') {
        setIsDecoding(true);
      } else if (status === 'complete') {
        setIsDecoding(false);
        const cleanText = text.trim().replace(/[^\w\s]/gi, '').toLowerCase();
        setResult(text);
        
        // Evaluate pronunciation
        if (cleanText.includes(targetWord.toLowerCase())) {
          setIsMatch(true);
        } else {
          setIsMatch(false);
        }
      } else if (status === 'error') {
        setIsDecoding(false);
        setProgress(`Error: ${error}`);
      }
    };
    
    // Load model
    worker.current.postMessage({ type: 'load' });
    
    return () => worker.current?.terminate();
  }, []);

  const startRecording = async () => {
    try {
      audioBuffer.current = new Float32Array(0);
      setIsMatch(null);
      setResult('');
      
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
      console.error('Mic error:', err);
      alert('Microphone access denied or error occurred.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (processor.current && audioContext.current) {
      processor.current.disconnect();
      audioContext.current.close();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
    }
    
    // Send 16kHz float32 audio array to Web Worker
    worker.current?.postMessage({
      type: 'transcribe',
      audio: audioBuffer.current
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6 font-mono">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
        
        {/* Status Indicator */}
        <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-6">
          {!isReady ? (
            <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> {progress}</span>
          ) : (
            <span className="text-emerald-400">⚡ Local AI Ready (Zero Cost)</span>
          )}
        </div>

        {/* The Target Card */}
        <div className="text-zinc-400 mb-2">Read this word:</div>
        <h1 className="text-5xl font-black tracking-tight mb-8">
          🍎 {targetWord}
        </h1>

        {/* Action Button */}
        <button
          disabled={!isReady || isDecoding}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.5)]' 
              : !isReady || isDecoding
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-white text-black hover:scale-105 shadow-xl'
          }`}
        >
          {isDecoding ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 fill-white" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
        <div className="mt-4 text-sm text-zinc-500 text-center">
          {isRecording ? "Release to Send" : "Hold to Speak"}
        </div>

        {/* Results Area */}
        <div className="mt-8 min-h-24 flex flex-col items-center justify-center w-full">
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-zinc-500 text-sm mb-1">AI Heard:</div>
              <div className="text-xl font-medium mb-3">&quot;{result}&quot;</div>
              
              {isMatch === true && (
                <div className="text-emerald-400 font-bold flex items-center justify-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" /> Perfect Pronunciation!
                </div>
              )}
              {isMatch === false && (
                <div className="text-red-400 font-bold flex items-center justify-center gap-2 text-lg">
                  Oops! Try saying &quot;{targetWord}&quot;
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-zinc-600 text-xs text-center max-w-sm">
        This demo uses Transformers.js to run Whisper-tiny entirely in your browser. 
        No audio ever leaves your device. 100% Privacy. $0 API Cost.
      </p>
    </div>
  );
}
