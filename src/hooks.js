/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	return await resolve(event);
};
