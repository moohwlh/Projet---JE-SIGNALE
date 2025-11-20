import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors :{
        cyber :{
       primary:'#FF3D00',
       black : '#050505',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;