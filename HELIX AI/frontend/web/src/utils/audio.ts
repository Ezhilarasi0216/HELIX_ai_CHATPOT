// Decodes base64 string to Uint8Array
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Encodes Uint8Array to base64 string
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Converts raw PCM Int16 bytes to an AudioBuffer for playback
export function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): AudioBuffer {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Creates a PCM Blob from Float32 microphone data (downsamples to Int16)
export function float32ToPcm16(data: Float32Array): Uint8Array {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values
    let s = Math.max(-1, Math.min(1, data[i]));
    // Convert to Int16
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return new Uint8Array(int16.buffer);
}

export class AudioQueue {
  private audioCtx: AudioContext;
  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();
  private sampleRate: number;

  constructor(sampleRate: number = 24000) {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
    this.sampleRate = sampleRate;
  }

  async addChunk(base64Data: string) {
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const bytes = decode(base64Data);
    const buffer = pcmToAudioBuffer(bytes, this.audioCtx, this.sampleRate);

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);

    // Schedule playback
    const currentTime = this.audioCtx.currentTime;
    // If nextStartTime is in the past, reset it to now
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }

    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;

    this.sources.add(source);
    source.onended = () => {
      this.sources.delete(source);
    };
  }

  stop() {
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    this.nextStartTime = 0;
  }

  async close() {
    this.stop();
    await this.audioCtx.close();
  }
}

// Text-to-Speech Helper
export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Attempt to find a Tamil voice
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.startsWith('ta'));
    if (tamilVoice) {
      utterance.voice = tamilVoice;
      utterance.lang = 'ta-IN';
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};