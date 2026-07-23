export class SpeechToTextService {
   private recognition: any;

   constructor() {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
         this.recognition = new SpeechRecognition();
         this.recognition.continuous = false;
         this.recognition.interimResults = false;
      }
   }

   startListening(lang: string = 'en-US'): Promise<string> {
      return new Promise((resolve, reject) => {
         if (!this.recognition) {
            reject('Speech recognition not supported');
            return;
         }

         this.recognition.lang = lang;
         this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
         };

         this.recognition.onerror = (event: any) => {
            reject(event.error);
         };

         this.recognition.start();
      });
   }

   stopListening() {
      if (this.recognition) {
         this.recognition.stop();
      }
   }
}

export const sttService = new SpeechToTextService();
