export class TextToSpeechService {
   private synth: SpeechSynthesis;

   constructor() {
      this.synth = window.speechSynthesis;
   }

   speak(text: string, lang: string = 'en-US', voiceURI?: string, options: { rate?: number; pitch?: number } = {}): void {
      if (!this.synth) return;
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;

      if (voiceURI) {
         const voices = this.synth.getVoices();
         const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
         if (selectedVoice) {
            utterance.voice = selectedVoice;
         }
      } else {
         // Auto-optimizer logic falls here if needed
         const voices = this.synth.getVoices();
         const googleVoice = voices.find(v => v.lang.includes(lang.split('-')[0]) && v.name.includes('Google'));
         if (googleVoice) utterance.voice = googleVoice;
      }

      this.synth.speak(utterance);
   }

   stop(): void {
      if (this.synth) {
         this.synth.cancel();
      }
   }
}

export const ttsService = new TextToSpeechService();
