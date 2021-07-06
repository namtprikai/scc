import { GetRootMenu } from "../../allInOneCsv/makeScript";
import { AllInOneCsvMaker } from "../../allInOneCsv";
import { csvSt } from "./data/352_FAQ_201029_1041";
import { message } from "./data/defaultMessage_dev";
import { scenarioBot } from "./data/scenarioBot_v2";
import csvSync from "csv-parse/lib/sync";
// fsをモック
jest.mock("fs");
test("makeScript GetRootMenu", () => {
	expect(
		GetRootMenu([
			{
				id: "1",
				parent: "#",
				position: 2,
				text: "asdf",
				type: "node",
				status: "published",
				value: "value",
				title: "title",
				items: {},
			},
		])
	).toStrictEqual(["asdf"]);
});
test("AllInOneCsvMaker CSV to JSON", () => {
	const fileText = csvSync(csvSt, { relax_column_count: true });
	const { talkScript, scenario, rootmenu } = AllInOneCsvMaker.start(
		fileText,
		message
	);
	console.log(scenario);
	console.log(scenarioBot);
	expect(scenario).toEqual(scenarioBot);
});
