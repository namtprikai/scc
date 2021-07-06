import { Conf } from "@/env/env";
import { ChildConf } from "../env/env";
const Env: any = process.env.NODE_ENV;
console.log(Conf);
console.log(Env);
export const CLIENT_ID = process.env.API_CLIENT_ID || process.env.CLIENT_ID || "4";
export const apiUrl = ChildConf[Env].ApiUrl || Conf[Env].ApiUrl;

export const subsystemUrl = ChildConf[Env].subsystemUrl || Conf[Env].subsystemUrl;
export const scriptUrl = ChildConf[Env].scriptUrl || Conf[Env].scriptUrl;
export const s3 = ChildConf[Env].s3 || Conf[Env].s3;
export const script_logUrl = ChildConf[Env].cript_logUrl || Conf[Env].script_logUrl;
export const bartUrl = ChildConf[Env].bartUrl || Conf[Env].bartUrl;
export const packageUrl = ChildConf[Env].packageUrl || Conf[Env].packageUrl;
export const windowUrl = ChildConf[Env].windowUrl || Conf[Env].windowUrl;
export const testWindowUrl = ChildConf[Env].testWindowUrl || Conf[Env].testWindowUrl;
export const version = "v3.0.7";
export const Type = "tag";
