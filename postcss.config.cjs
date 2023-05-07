const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssLoadConfig = require('postcss-load-config');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const config = {
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    autoprefixer(),
    !dev &&
      cssnano({
        preset: 'default',
      }),
  ],
};

// module.exports = config

module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    // autoprefixer(),
    !dev &&
      cssnano({
        preset: 'default',
      }),
  ],
  options: {
    autoprefixer: {
      browsers: ['last 2 versions', '> 1%'],
    },
  },
};
