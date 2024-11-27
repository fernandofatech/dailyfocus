/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Inclui todos os arquivos JSX/TSX
    "./src/app/**/*.{js,ts,jsx,tsx}", // Especificamente para a pasta app
  ],
  theme: {
    extend: {}, // Adicione customizações aqui, se necessário
  },
  plugins: [], // Adicione plugins aqui, se necessário
};
