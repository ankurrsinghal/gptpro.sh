import { writable } from 'svelte/store';

interface FilterStoreParams {
  isArchived: boolean;
  isFavorite: boolean;
}

export function filtersStore() {
	const isArchived = writable(false);
	const isFavorite = writable(false);

	return {
		isArchived,
		isFavorite,
	};
}
