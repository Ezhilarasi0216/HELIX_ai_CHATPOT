// Helper to check for critical keywords client-side for immediate reaction
export const checkCrisisKeywords = (text: string): boolean => {
   const keywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self-harm', 'hurt myself', 'hopeless', 'no way out'];
   const lower = text.toLowerCase();
   return keywords.some(k => lower.includes(k));
};

// Helper to check for sad/negative words that should trigger camera activation
export const checkSadWords = (text: string): boolean => {
   const sadKeywords = [
      // English sad words
      'sad', 'depressed', 'depression', 'lonely', 'loneliness', 'hopeless', 'worthless',
      'empty', 'broken', 'crying', 'cry', 'tears', 'hurt', 'hurting', 'pain', 'painful',
      'suffering', 'miserable', 'unhappy', 'down', 'low', 'upset', 'disappointed',
      'heartbroken', 'devastated', 'grief', 'grieving', 'lost', 'helpless', 'desperate',
      // Tamil sad words
      'சோகம்', 'சோகமாக', 'தனிமை', 'வலி', 'அழுகை', 'அழுகிறேன்', 'வருத்தம்', 'வருத்தமாக',
      'கவலை', 'கவலையாக', 'மனச்சோர்வு', 'நம்பிக்கையற்ற', 'உடைந்த', 'காயம்'
   ];

   const lower = text.toLowerCase();
   return sadKeywords.some(k => lower.includes(k.toLowerCase()));
};
