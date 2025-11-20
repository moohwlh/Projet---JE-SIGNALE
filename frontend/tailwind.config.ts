import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#FF3D00',
          black: '#050505',
          border: '#1F2937', 
        }
      },
      boxShadow: {
        'neon-sm': '0 0 5px rgba(255, 61, 0, 0.5)',
        'neon-lg': '0 0 20px rgba(255, 61, 0, 0.8)',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;