import type {
	GetMarathonsFrontPageResponse,
	GetPatreonsResponse,
	Marathon,
	MarathonSettings,
	Patreon,
	Schedule,
	ScheduleInfo
} from './types';

type GetResponse<T> = { data: T; error: null } | { data: null; error: unknown };

const baseUrl = 'https://oengus.io/api/v2';
const baseUrlV1 = 'https://oengus.io/api/v1';

/**
 * https://oengus.io/api/v2/marathons/for-home
 */
async function getMarathonsFrontPage(): Promise<GetResponse<GetMarathonsFrontPageResponse>> {
	try {
		const response = await fetch(`${baseUrl}/marathons/for-home`);
		const data = (await response.json()) as GetMarathonsFrontPageResponse;
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

/**
 * https://oengus.io/api/v2/marathons/{marathonId}/schedules/{scheduleId}/lines
 */
async function getMarathonScheduleById(
	marathonId: string,
	scheduleId: string
): Promise<GetResponse<Schedule>> {
	try {
		const response = await fetch(
			`${baseUrl}/marathons/${marathonId}/schedules/${scheduleId}/lines`
		);
		const data = (await response.json()) as Schedule;
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

/**
 * 	https://oengus.io/api/v2/marathons/{marathonId}/schedules
 */
async function getMarathonSchedule(id: string): Promise<GetResponse<ScheduleInfo[]>> {
	try {
		const response = await fetch(`${baseUrl}/marathons/${id}/schedules`);
		const data = (await response.json()) as { data: ScheduleInfo[] };
		return { data: data.data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

/**
 * https://oengus.io/api/v2/marathons/{marathonId}/schedules/for-slug/{slug}
 */
async function getMarathonScheduleBySlug(
	marathonId: string,
	slug: string
): Promise<GetResponse<Schedule>> {
	try {
		const response = await fetch(`${baseUrl}/marathons/${marathonId}/schedules/for-slug/${slug}`);
		const data = (await response.json()) as Schedule;
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

/**
 * https://oengus.io/api/v2/marathons/{id}/settings
 */
async function getMarathonSettings(id: string): Promise<GetResponse<MarathonSettings>> {
	try {
		const response = await fetch(`${baseUrl}/marathons/${id}/settings`);
		const data = (await response.json()) as MarathonSettings;
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

/**
 * https://oengus.io/api/v1/marathons/{id}
 */
async function getMarathon(id: string): Promise<GetResponse<Marathon>> {
	try {
		const response = await fetch(`${baseUrlV1}/marathons/${id}`);
		const data = await response.json();
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

/**
 * https://oengus.io/api/patreon/patrons
 */
async function getPatrons(): Promise<GetResponse<Patreon[]>> {
	try {
		const response = await fetch(`https://oengus.io/api/patreon/patrons`);
		const data = (await response.json()) as GetPatreonsResponse;
		return { data: data.patrons, error: null };
	} catch (error) {
		return { data: null, error };
	}
}

export const oengusApi = {
	users: {},
	schedules: {
		get: getMarathonSchedule,
		getById: getMarathonScheduleById,
		getBySlug: getMarathonScheduleBySlug
	},
	marathons: {
		get: getMarathon,
		getFrontPage: getMarathonsFrontPage,
		moderators: () => {},
		questions: () => {},
		settings: getMarathonSettings
	},
	submissions: {},
	patreons: {
		get: getPatrons
	}
};
