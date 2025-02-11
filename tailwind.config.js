/** @type {import('tailwindcss').Config} */
module.exports = {
  // have to tell tailwind each time we make a new file , that build the css components for that new file
  content: ['./views/layouts/main.ejs','./views/partials/footer.ejs','./views/partials/mealkit.ejs','./views/partials/navbar.ejs',
            './views/home.ejs','./views/on-the-menu.ejs','./views/log-in.ejs','./views/sign-up.ejs','./views/proff-self-prac.html'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],

  daisyui: {
    themes: ['cupcake','cyberpunk','lemonade'],
  },
}

