import { error } from '@sveltejs/kit';
import { oengusApi } from '$lib/api';

export async function load({ fetch, params }) {
	const { slug } = params;

	const scheduleInfo = await oengusApi.schedules.get(slug);

	if (scheduleInfo.error || !scheduleInfo.data) {
		error(500, 'Failed to fetch schedule information');
	}

	const scheduleSlug = scheduleInfo.data[0].slug;

	const schedule = await oengusApi.schedules.getBySlug(slug, scheduleSlug);

	if (schedule.error || !schedule.data) {
		error(404, 'Schedule not found');
	}

	const settings = await oengusApi.marathons.get(slug);

	if (settings.error || !settings.data) {
		error(404, 'Marathon settings not found');
	}

	if (settings.error || !settings.data) {
		error(500, 'Failed to fetch marathon settings');
	}

	return {
		scheduleInfo: scheduleInfo.data[0],
		schedule: schedule.data,
		settings: settings.data
	};

	// try {

	// 	const response = await fetch(`${'https://oengus.io/api/v2'}/marathons/${marathonId}/schedules/for-slug/${slug}`);
	// 	// const data = (await response.json()) as Schedule;

	// 	// const res = await fetch(`https://oengus.io/api/v1/marathons/${params.slug}/schedule`);
	// 	// const data = (await res.json()) as { id: number; lines: Run[] };

	// 	console.info(data);

	// 	return data;
	// } catch (err) {
	// 	error(404, 'Not found');
	// }
}
