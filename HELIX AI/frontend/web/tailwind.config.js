/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         animation: {
            marquee: "marquee var(--duration) linear infinite",
            "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
            "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
         },
         keyframes: {
            marquee: {
               from: { transform: "translateX(0)" },
               to: { transform: "translateX(calc(-100% - var(--gap)))" },
            },
            "marquee-vertical": {
               from: { transform: "translateY(0)" },
               to: { transform: "translateY(calc(-100% - var(--gap)))" },
            },
            "border-beam": {
               "100%": {
                  "offset-distance": "100%",
               },
            },
         },
      },
   },
   plugins: [],
}
