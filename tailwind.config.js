/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'coral-red': '#FE3A4A',
                'golden-poppy': '#FEC501',
            },
        },
    },
    plugins: [],
};
