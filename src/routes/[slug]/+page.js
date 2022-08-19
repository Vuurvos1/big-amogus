import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	// console.log(params.slug);

	try {
		const res = await fetch(`https://oengus.io/api/marathons/${params.slug}/schedule`);
		// console.log(await res.text());
		const data = await res.json();

		return data;

		// console.log(data);
	} catch (err) {
		throw error(404, 'Not found');
	}

	// console.log(res);

	// console.log(data);

	// if (params.slug === 'hello-world') {
	// 	return {
	// 		title: 'Hello world!',
	// 		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	// 	};
	// }
}
