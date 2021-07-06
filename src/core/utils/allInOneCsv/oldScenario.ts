export interface IBotConfigState {
	BotConfig: any;
	// TalkScriptTree:any;
}
interface Items {
	[log: string]: Array<string> | string | boolean;
}
export interface BotConfigFlow {
	step: string;
	condition: { value: string; type: "number" | "text" | "id" };
	label?: string;
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
		flow: { step: "init"; next: Array<BotConfigFlow> };
	};
}
