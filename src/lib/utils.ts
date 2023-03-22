import { onMount } from 'svelte';

export const isClient = typeof window !== undefined;

export function onMountFocusRef() {
	const ref: { current: HTMLInputElement | HTMLTextAreaElement | null } = { current: null };

	onMount(() => {
		if (ref !== null) {
			ref.current?.focus();
		}
	});

	return ref;
}

export function areEqualShallow<T>(a: T, b: T) {
	for (const key in a) {
		if (a[key] !== b[key]) {
			return false;
		}
	}
	return true;
}
