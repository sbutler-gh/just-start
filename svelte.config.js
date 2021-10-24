import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";
import preprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
const config = {
    "extensions": [".svelte", ...mdsvexConfig.extensions],

    kit: {
        adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},
    vite: {
        optimizeDeps: {
            include: ['@fullcalendar/core', '@fullcalendar/icalendar']
        }
    },

    preprocess: [preprocess({
        postcss: true
    }), mdsvex(mdsvexConfig)]
};

export default config;
