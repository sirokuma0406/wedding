import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { id }, parent }) => {
	const { photos } = await parent();

	const photo = photos.find((_) => _.id === id);
	if (!photo) {
		throw error(404, 'not found');
	}

	return {
		photo
	};
}) satisfies PageServerLoad;
