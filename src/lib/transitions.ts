import { quadInOut } from 'svelte/easing';

export function slideIn(_: HTMLElement, { delay = 0, duration = 300 } = {}): TransitionConfig {
	return {
		delay,
		duration,
		easing: quadInOut,
		css: (t: number) => {
			return `transform: translateX(${(t - 1) * 100}%)`;
		}
	};
}
