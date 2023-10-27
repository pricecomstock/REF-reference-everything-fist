import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | undefined;

// The theme was set in app.html to prevent flashing
const userTheme = (browser && (localStorage.getItem('theme') as Theme)) || undefined;

export const theme = writable<Theme>(userTheme);

theme.subscribe((newTheme) => {
	if (browser && newTheme) {
		document.documentElement.setAttribute('color-scheme', newTheme);
		localStorage.setItem('color-scheme', newTheme);
	}
});

export function toggleTheme() {
	theme.update((currentTheme: Theme) => {
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		return newTheme;
	});
}

export function setTheme(newTheme: Theme) {
	theme.set(newTheme);
}
