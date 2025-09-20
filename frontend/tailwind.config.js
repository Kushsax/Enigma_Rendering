 import daisyui from "daisyui"

 /** @type {import('tailwindcss').Config} */
const config = {
   content: ["./src/**/*.{html,js,jsx}","./public/index.html"  ],
   theme: {
     extend: {},
   },
   plugins: [daisyui],
   daisyui: ["forest"],
 }

 export default config;