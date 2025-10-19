import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'production',
			strategies: 'generateSW',
			scope: '/',
			base: '/',
			manifest: {
				name: 'FIST Reference',
				short_name: 'FIST Ref',
				description: 'Offline reference for FIST: Ultra Edition tabletop RPG',
				theme_color: '#1a1a1a',
				background_color: '#1a1a1a',
				display: 'standalone',
				icons: [
					{
						src: '/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/apple-touch-icon.png',
						sizes: '180x180',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json}'],
				globIgnores: ['**/node_modules/**/*', 'server/**'],
				skipWaiting: true,
				clientsClaim: true,
				navigateFallback: '/index.html',
				navigateFallbackDenylist: [/^\/_app\//, /^\/api\//],
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname.endsWith('__data.json'),
						handler: 'CacheFirst',
						options: {
							cacheName: 'fist-ref-data',
							expiration: {
								maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
								maxEntries: 200
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'fist-ref-images',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
							}
						}
					},
					{
						urlPattern: ({ request }) => request.mode === 'navigate',
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'fist-ref-pages',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
							}
						}
					}
				]
			},
			devOptions: {
				enabled: false, // Disable in dev - PWA works best in production
				type: 'module'
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
