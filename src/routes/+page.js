import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	try {
		const res = await fetch(`https://oengus.io/api/marathons/`);
		return await res.json();
	} catch (err) {
		throw error(404, 'Not found');
	}
}
