/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--primary) / <alpha-value>)",
                secondary: "rgb(var(--secondary) / <alpha-value>)",
                accent: "rgb(var(--accent) / <alpha-value>)",
                warning: "rgb(var(--warning) / <alpha-value>)",
                danger: "rgb(var(--danger) / <alpha-value>)",
                background: "rgb(var(--background) / <alpha-value>)",
                surface: "rgb(var(--surface) / <alpha-value>)",
                "primary-foreground": "#FFFFFF",
            },
            boxShadow: {
                'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
                'premium-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 15px -4px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [],
}
