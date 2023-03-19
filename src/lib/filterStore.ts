import { writable } from 'svelte/store';

interface FilterStoreParams {
  isArchived: boolean;
}

export function filtersStore() {
	const isArchived = writable(false);

	return {
		isArchived,
	};
}
