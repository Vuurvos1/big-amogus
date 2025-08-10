export type Marathon = {
	id: string;
	name: string;
	creator: {
		id: number;
		username: string;
		displayName: string;
		enabled: boolean;
		roles: string[];
		connections: {
			id: number;
			user: null | string;
			platform: string;
			username: string;
			usernameValidForPlatform: boolean;
		}[];
		emailVerified: boolean;
		pronouns: string[];
		country: string | null;
		languagesSpoken: string[];
		usernameJapanese: string;
	};
	startDate: string; // ISO 8601 format
	endDate: string; // ISO 8601 format
	submissionsStartDate: string; // ISO 8601 format
	submissionsEndDate: string; // ISO 8601 format
	description: string;
	location: string;
	language: string;
	maxGamesPerRunner: number;
	maxCategoriesPerGame: number;
	hasMultiplayer: boolean;
	maxNumberOfScreens: number;
	twitch?: string;
	twitter?: string;
	mastodon?: string;
	discord?: string;
	youtube?: string;
	country: string;
	discordPrivacy: boolean;
	submitsOpen: boolean;
	defaultSetupTime: string; // ISO 8601 duration format
	selectionDone: boolean;
	scheduleDone: boolean;
	donationsOpen: boolean;
	isPrivate: boolean;
	onsite: boolean;
	videoRequired: boolean;
	unlimitedGames: boolean;
	unlimitedCategories: boolean;
	emulatorAuthorized: boolean;
	moderators: {
		id: number;
		username: string;
		displayName: string;
		enabled: boolean;
		roles: string[];
		connections: {
			id: number;
			user: null | string;
			platform: string;
			username: string;
			usernameValidForPlatform: boolean;
		}[];
		emailVerified: boolean;
		pronouns: string[];
		country: string | null;
		languagesSpoken: string[];
		usernameJapanese: string;
	}[];
	hasIncentives: boolean;
	hasDonations: boolean;
	payee: string;
	supportedCharity: string;
	donationCurrency: string;
	webhook: string;
	announceAcceptedSubmissions: boolean;
};

// might be duplicate?
export type MarathonSettings = {
	id: string;
	name: string;
	description: string;
	isPrivate: boolean;
	startDate: string; // '2019-08-24T14:15:22Z';
	endDate: string; // '2019-08-24T14:15:22Z';
	submissionsStartDate: string; //  '2019-08-24T14:15:22Z';
	submissionsEndDate: string; // '2019-08-24T14:15:22Z';
	onsite: boolean;
	location: string;
	country: string;
	language: string;
	maxGamesPerRunner: number;
	maxCategoriesPerGame: number;
	allowMultiplayer: boolean;
	maxNumberOfScreens: 1;
	videoRequired: boolean;
	allowEmulators: boolean;
	discordRequired: boolean;
	discordGuildId: string;
	discordGuildName: string;
	submissionsOpen: boolean;
	unlimitedGames: boolean;
	unlimitedCategories: boolean;
	twitch: string;
	twitter?: string;
	mastodon?: string;
	discord?: string;
	youtube?: string;
	discordPrivate: boolean;
	defaultSetupTime: string; // 'PT30M';
	selectionDone: boolean;
	scheduleDone: boolean;
	donationsOpen: boolean;
	hasIncentives: boolean;
	hasDonations: boolean;
	payee: string;
	supportedCharity: string;
	donationCurrency: string;
	webhook: string;
	announceAcceptedSubmissions: boolean;
};

export type Connection = {
	id: number;
	platform: string;
	username: string;
};

export type Profile = {
	id: number;
	username: string;
	displayName: string;
	enabled: boolean;
	pronouns: string[];
	languagesSpoken: string[];
	banned: boolean;
	country: string;
	connections: Connection[];
};

export type Runner = {
	profile: Profile;
	runnerName: string;
};

export type RunType = 'SINGLE' | 'RACE' | 'COOP' | 'COOP_RACE' | 'OTHER' | 'RELAY' | 'RELAY_RACE';
export type SocialPlatform = 'TWITTER' | 'DISCORD' | 'TWITCH' | 'YOUTUBE' | 'SPEEDRUNCOM';

export type Run = {
	id: number;
	game: string;
	console: string;
	emulated: boolean;
	ratio: string;
	type: RunType;
	runners: Runner[];
	category: string;
	estimate: string; // 'PT5H30M20S';
	setupTime: string; // 'PT5H30M20S';
	position: number;
	customRun: boolean;
	setupBlock: boolean;
	setupBlockText: string;
	customData: string;
	date: string; // '2019-08-24T14:15:22Z';
	categoryId: number;
};

export type Schedule = { lines: Run[] };

export type ScheduleInfo = {
	id: number;
	marathonId: string;
	name: string;
	slug: string;
	published: true;
};

export type Patreon = {
	full_name: string;
	id: string;
	image_url: string;
};

export type GetMarathonsFrontPageResponse = {
	live: Marathon[];
	next: Marathon[];
	open: Marathon[];
};

export type GetPatreonsResponse = {
	patrons: Patreon[];
};
