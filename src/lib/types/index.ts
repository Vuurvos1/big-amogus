export type Run = {
	id: number;
	gameName: string;
	console: string;
	emulated: boolean;
	ratio: string;
	categoryName: string;
	categoryId: number;
	estimate: string;
	setupTime: string;
	setupBlock: boolean;
	customRun: boolean;
	position: number;
	type: string;
	runners: Runner[];
	setupBlockText: string;
	date: string;
	customDataDTO: string;
	time: string;
	effectiveSetupTime: string;
};

export type Runner = {
	id: number;
	username: string;
	displayName: string;
	pronouns: string[];
	languagesSpoken: string[];
	country: string;
	connections: RunnerConnection[];
};

export type RunnerConnection = {
	id: number;
	platform: 'SPEEDRUNCOM' | 'TWITCH' | 'TWITTER' | 'DISCORD';
	username: string;
};
