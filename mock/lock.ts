import {ILook} from "../src/core/api/types";
import { productions } from "./products";
import { roles } from "./roles";
import { secureObjectCreateByAdmin, secureObjectCreateByUser } from "./security";
import { SAITableModel } from "./utils";
let looks:Array<ILook> = [];
const Looks = secureObjectCreateByAdmin<ILook>(
	() => looks,
	(p) => productions
);
const LooksByUser = secureObjectCreateByUser<ILook>(
	() => looks,
	(p) => roles
);

const LooksModel = new SAITableModel(looks,'/question/', Looks, LooksByUser);
