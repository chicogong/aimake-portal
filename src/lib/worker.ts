import { pipeline, env } from '@huggingface/transformers';

// Ignore local models since we are running in the browser
env.allowLocalModels = false;

class PipelineSingleton {
  static task = 'automatic-speech-recognition' as const;
  static model = 'onnx-community/whisper-tiny.en'; // Verified community ONNX weights
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static instance: any = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getInstance(progress_callback?: any) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback: (data: any) => {
          // If loaded property exists and equals total, or if it's super fast, it's from cache
          const isFromCache = data.loaded === data.total && data.total > 0;
          if (progress_callback) {
            progress_callback({ ...data, isFromCache });
          }
        },
        device: 'wasm', 
        dtype: 'fp32', // CRITICAL: iOS/WeChat Safari WASM engine has a fatal bug with q8/q4 DequantizeLinear nodes. fp32 is mandatory for mobile browser compatibility.
      });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, audio } = event.data;

  if (type === 'load') {
    // Preload the model
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await PipelineSingleton.getInstance((progress: any) => {
      self.postMessage({ status: 'progress', data: progress });
    });
    self.postMessage({ status: 'ready' });
  } else if (type === 'transcribe') {
    try {
      const { expectedWord } = event.data;
      const transcriber = await PipelineSingleton.getInstance();
      self.postMessage({ status: 'decoding' });

      // Run inference with initial_prompt for accuracy boosting
      const result = await transcriber(audio, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: 'english',
        task: 'transcribe',
        initial_prompt: expectedWord ? expectedWord : undefined, // Bias the model!
      });

      self.postMessage({ status: 'complete', text: result.text });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      self.postMessage({ status: 'error', error: err.message });
    }
  }
});
