import { Main } from "./makeCsv";
import { makeScriptAndScenario, UpdateInfoMessage, CleanRegExp, GetRootMenu, makeScriptAndScenarioByData, validateAllInOneCsv } from "./makeScript";
export namespace AllInOneCsvMaker {
	export const makeCsv = Main;
	export const start = makeScriptAndScenario;
	export const updateInfoMessage = UpdateInfoMessage;
	export const cleanRegExp = CleanRegExp;
	export const getRootMenu = GetRootMenu;
	export const MakeScriptAndScenarioByData = makeScriptAndScenarioByData;
	export const ValidateAllInOneCsv = validateAllInOneCsv;
}
