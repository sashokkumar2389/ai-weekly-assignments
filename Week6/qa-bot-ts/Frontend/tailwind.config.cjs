/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    500: "#3b82f6",
                    600: "#2563eb",
                    700: "#1d4ed8",
                },
                chat: {
                    user: "#eff6ff",
                    assistant: "#f8fafc",
                    userDark: "#1e3a5f",
                    assistantDark: "#1e293b",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            maxWidth: {
                chat: "900px",
            },
            animation: {
                "typing-dot": "typingDot 1.4s infinite",
            },
        },
    },
    plugins: [],
};
