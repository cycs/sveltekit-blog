import adapter from '@sveltejs/adapter-auto';
import path from 'path';
import postcssConfig from './postcss.config.cjs';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),

    alias: {
      $components: path.resolve('./src/lib/components'),
      $lib: path.resolve('./src/lib'),
      $stores: path.resolve('/src/stores'),
    },
  },

  preprocess: [
    vitePreprocess({
      plugins: postcssConfig.plugins,
      parserOptions: {
        from: undefined, // Let postcss-load-config handle the `from` option
      },
      postcss: true,
    }),
  ],
};

export default config;
