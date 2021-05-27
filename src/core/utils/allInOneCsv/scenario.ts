export interface IBotConfigState {
	BotConfig: any;
	// TalkScriptTree:any;
}
interface Items {
	[log: string]: Array<string> | string | boolean;
}
export interface BotConfigFlow {
	id: string;
	label: string;
	text: string;
	next: Array<BotConfigFlow>;
	items: Items;
}

export interface BotConfig {
	title: string;
	description: string;
	flow: { step: 'init'; next: Array<BotConfigFlow> };
}
export namespace OldSearchScenario {
	export interface IScenarioState {
		ScenarioList: Array<Scenario>;
		// TalkScriptTree:any;
	}
	export interface ScenarioFlow {
		step: string;
		condition?: { value: string };
		next: Array<ScenarioFlow>;
	}
	export interface ScenarioStep {
		id: string;
		type: string;
		items?: { [log: string]: Array<any> | any };
		title: string;
		text: string;
    options: Array<{ value: string }> | null;
    scenarioId: string;
	}
	export interface Scenario {
		id: string;
		title: string;
		step: { [key: string]: ScenarioStep };
		flow: Array<ScenarioFlow>;
		value: string;
		scenarioId: string;
	}
}
export namespace OldScenario {
	export interface IBotConfigState {
		BotConfig: any;
		// TalkScriptTree:any;
	}
	interface Items {
		[log: string]: Array<string> | string | boolean;
	}
	export interface BotConfigFlow {
		title: string;
		value: string;
		step: string;
		condition: { value: string; type: 'number' | 'string' | 'or' };
		next: Array<BotConfigFlow>;
	}
	export interface BotConfigStep {
		action: {
			success: { type: string; value: string; items: Items };
			error: { type: string; value: string };
		};
	}
	export interface BotConfig {
		scenario: {
			title: string;
			description: string;
			steps: { [id: string]: BotConfigStep };
			flow: {
				root: { step: 'init'; next: Array<BotConfigFlow> };
			};
		};
	}
}
