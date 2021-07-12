import { ISAIAPIData, IAdminData, IUserData } from '../src/core/api/types';
import { productAdmins } from './product_admins';
import { ProductRoleFilter, RoleFilter } from './security';
export function getId(rows: Array<{ id: number, [key: string]: any }>) {
	let maxId = 0;
	for (const row of rows) {
		maxId = Math.max(row.id, maxId);
	}
	return (maxId += 1);
}
export class SAITableModel<ISAIAPIData>{
	constructor(protected table: Array<ISAIAPIData>, protected modelAdmin:ProductRoleFilter<ISAIAPIData>,protected modelUser:RoleFilter<ISAIAPIData>) { }
	public add(row: ISAIAPIData) {
		this.table.push(row);
	}
	public delete(id: number) {
		this.table = this.table.filter(r=>r.id !== id);
	}
	getListByAdmin(admin: IAdminData) {

	}
	getListByUser(user: IUserData) {

	}
}
export class CrossReferenceTable {
	constructor(private aName: string, private bName) {

	}
	private getMaxId(table: Array<ISAIAPIData>) {
		let maxId = 0;
		for (const row of table) {
			maxId = Math.max(row.id, maxId);
		}
		return (maxId += 1);
	}
	add(aId: number, bId: number, table: Array<ISAIAPIData>) {
		const id = this.getMaxId(table);
		table.push({
			id,
			[this.aName]: aId,
			[this.bName]: bId,
		});
	}
	getByAdmin(admin: IAdminData, name: string, table: Array<ISAIAPIData>, targetTable: Array<ISAIAPIData>) { }
	getByUser(user: IUserData, name: string, table: Array<ISAIAPIData>, targetTable: Array<ISAIAPIData>) { }
	deleteById(id: number, name: string, table: Array<ISAIAPIData>) {

	}

}
