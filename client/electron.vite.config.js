import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import viteSvgr from 'vite-plugin-svgr';

export default defineConfig({
	publicDir: false,
	main: {},
	preload: {},
	renderer: {
		plugins: [react(), eslint(), viteSvgr()],
	},
});
