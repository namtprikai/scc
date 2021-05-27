import { BotConfig, BotConfigFlow } from './scenario';
import { TalkScript, RootTalkScript } from './script';
import { Main } from './makeCsv';
import { AllInOneCsvMaker } from './index';
const fs = require('fs');
const csvSync = require('csv-parse/lib/sync');
const bot_csv = csvSync(fs.readFileSync('./input.csv', 'utf-8'));
const { talkScript, scenario } = AllInOneCsvMaker.start(bot_csv);
fs.writeFileSync('./talkScript.json', JSON.stringify({ body: talkScript }));
fs.writeFileSync('./scenario.json', JSON.stringify({ scenario }));
const csvString = AllInOneCsvMaker.makeCsv(talkScript, scenario);

fs.writeFileSync('./allinone.csv', csvString);
