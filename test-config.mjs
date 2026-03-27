import { resolveConfig } from 'vite';
import astroConfig from './astro.config.mjs';
console.log(astroConfig.vite?.ssr?.noExternal);
