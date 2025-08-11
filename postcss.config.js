// postcss.config.js
// This file configures PostCSS to use Tailwind CSS and Autoprefixer.
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

// ✅ CORRECT PostCSS config
// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };
