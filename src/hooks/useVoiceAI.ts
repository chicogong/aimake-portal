import { useEffect, useRef, useState, useCallback } from 'react';

export function useVoiceAI(expectedWordRef: React.MutableRefObject<string>) {
  const worker = useRef<Worker | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const audioBuffer = useRef<Float32Array>(new Float32Array(0));
  
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState('Initializing AI Core...');
  const [isRecording, setIsRecording] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [heardText, setHeardText] = useState('');

  // Success Sound
  const playSuccessSound = useCallback(() => {
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
  }, []);

  // Setup Web Worker
  useEffect(() => {
    worker.current = new Worker(new URL('../lib/worker.ts', import.meta.url), {
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
      }
      else if (status === 'decoding') setIsDecoding(true);
      else if (status === 'complete') {
        setIsDecoding(false);
        setHeardText(text);
        
        // Validation against the ref
        const cleanText = text.trim().replace(/[^\w\s]/gi, '').toLowerCase();
        if (cleanText.includes(expectedWordRef.current.toLowerCase())) {
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
    return () => {
      worker.current?.terminate();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [expectedWordRef]);

  // TTS Helper
  const playWord = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; 
      utterance.pitch = 1.1; 
      window.speechSynthesis.speak(utterance);
    }
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
      expectedWord: expectedWordRef.current 
    });
  };

  const resetState = useCallback(() => {
    setIsMatch(null);
    setHeardText('');
  }, []);

  return {
    isReady,
    progress,
    isRecording,
    isDecoding,
    isMatch,
    heardText,
    startRecording,
    stopRecording,
    playWord,
    resetState,
    setIsReady // In case page needs to manually trigger it
  };
}
