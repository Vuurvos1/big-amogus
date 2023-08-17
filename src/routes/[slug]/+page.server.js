import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	try {
		const res = await fetch(`https://oengus.io/api/v1/marathons/${params.slug}/schedule`);
		return await res.json();
	} catch (err) {
		throw error(404, 'Not found');
	}
}
