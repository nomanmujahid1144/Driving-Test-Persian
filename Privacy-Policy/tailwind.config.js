
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: theme => ({
                'hero-img': "url('~/src/assets/hero-section-img.png')",
                'hero-img2': "url('~/src/assets/second-hero-section.png')"
            }),
            colors: {
                'myBg': '#E9C95D',
                'primaryText': '#515A5A',
                'secondaryText': '#FDFEFE',
                'loaderBg': 'rgba(0 , 0, 0 , 0.6)'
            },
            screens: {
                'xxs': '355px', // min-width
            },
        },
    },
    fontFamily: {
        'sans': ['Roboto', 'Arial', 'sans-serif'],
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],

}