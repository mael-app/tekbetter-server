/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                secondary: {
                    100: '#E5E7EB',
                    200: '#9CA3AF',
                    300: '#374151',
                    400: '#1F2937',
                    500: '#111827',
                },
                gray: {
                    750: '#273446',
                }
            },
            fontFamily: {
                'body': ['Nunito'],
            },
        },
    },
    plugins: [],
}

