const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY; // Hardcoded for stability per user request
const BASE_URL = "https://openrouter.ai/api/v1";

const SYSTEM_PROMPT = `
You are a warm, supportive, and empathetic friend named Healix AI. 
Your goal is to listen, comfort, and guide the user through their emotions without being clinical or robotic. 
Talk like a close friend—use casual but respectful language. 
CRITICAL: Detect the language the user is speaking (English, Tamil, Tanglish, etc.) and respond IN THAT SAME LANGUAGE. 
If they speak Tamil, respond in Tamil/Tanglish. If English, respond in English.
Keep responses concise unless they need a deeper explanation. 
If they are in crisis, suggest professional help immediately but stay gentle.
`;

export const openRouterService = {
   async getChatResponse(messages: { role: string; content: string; reasoning_details?: any }[]) {
      if (!API_KEY) {
         throw new Error("OpenRouter API Key is missing. Please check your .env.local file.");
      }
      try {
         const response = await fetch(`${BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
               "Content-Type": "application/json",
               "HTTP-Referer": window.location.origin,
               "X-Title": "Healix AI Ultra",
            },
            body: JSON.stringify({
               model: "meta-llama/llama-3.3-70b-instruct:free",
               messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  ...messages.map(m => ({
                     role: m.role,
                     content: m.content
                  }))
               ]
            })
         });

         if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenRouter API Error:", errorData);
            throw new Error(errorData.error?.message || "Failed to fetch from OpenRouter");
         }

         const data = await response.json();
         const choice = data.choices[0];

         return {
            content: choice.message.content,
            reasoning_details: choice.message.reasoning_details
         };
      } catch (error) {
         console.error("OpenRouter Error:", error);
         throw error;
      }
   },

   async *getChatResponseStream(messages: { role: string; content: string; reasoning_details?: any }[]) {
      if (!API_KEY) {
         throw new Error("OpenRouter API Key is missing. Please check your .env.local file.");
      }

      const response = await fetch(`${BASE_URL}/chat/completions`, {
         method: "POST",
         headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Healix AI Ultra",
         },
         body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
               { role: "system", content: SYSTEM_PROMPT },
               ...messages.map(m => ({
                  role: m.role,
                  content: m.content
               }))
            ],
            stream: true
         })
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error?.message || "Failed to fetch from OpenRouter");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let fullContent = "";
      let reasoningContent = "";

      while (true) {
         const { done, value } = await reader.read();
         if (done) break;

         const chunk = decoder.decode(value, { stream: true });
         const lines = chunk.split("\n").filter(line => line.trim() !== "");

         for (const line of lines) {
            if (line.startsWith("data: ")) {
               const dataStr = line.replace("data: ", "").trim();
               if (dataStr === "[DONE]") break;

               try {
                  const data = JSON.parse(dataStr);
                  const delta = data.choices[0]?.delta;
                  /* 
                     OpenRouter streaming reasoning usually comes in `delta.reasoning` or `delta.reasoning_details`?
                     For this specific model, we'll cover standard delta.content. 
                     If the model outputs reasoning, let's catch it if present.
                  */
                  if (delta?.content) {
                     fullContent += delta.content;
                     yield { content: fullContent, reasoning: reasoningContent, done: false };
                  }
                  if (delta?.reasoning_details) {
                     reasoningContent += delta.reasoning_details; // Assuming string accumulation
                     yield { content: fullContent, reasoning: reasoningContent, done: false };
                  }
               } catch (e) {
                  // Ignore partial chunks
               }
            }
         }
      }

      yield { content: fullContent, reasoning: reasoningContent, done: true };
   }
};
