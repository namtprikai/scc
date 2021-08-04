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
export class SAITableModel<T extends ISAIAPIData>{
	constructor(protected table: Array<T>, protected modelAdmin: ProductRoleFilter<T>, protected modelUser?: RoleFilter<T>) { }
	public add(data: T) {
		const row = {
			...data,
			created: new Date(),
			modified: new Date(),
		};
		row.id = this.getMaxId(this.table);
		this.table.push(row);
		return row;
	}
	private getMaxId(table: Array<T>): number {
		let maxId = 0;
		for (const row of table) {
			maxId = Math.max(row.id, maxId);
		}
		return (maxId += 1);
	}
	public delete(id: number, admin: IAdminData) {
		const row = this.table.find(r => r.id === id);
		if (row) {
			const isWhite = this.modelAdmin.isWhite(admin, row);
			if (isWhite) {
				this.table = this.table.filter(r => r.id !== id);
			} else {
				throw "権限エラー";
			}
		}
		throw "not found"
	}
	getListByAdmin(admin: IAdminData) {
		return this.modelAdmin.getData(admin);
	}
	getListByUser(user: IUserData) {
		return this.modelUser?.getData(user);
	}
}
export class CrossReferenceTable {
	constructor(private aName: string, private bName: string) {

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
	protected getBByA() { }
	protected getAByB(id: number, table: Array<ISAIAPIData>,) {
		return table.filter(t => t[this.bName] === id);
	}
	getByAdmin(admin: IAdminData, name: string, table: Array<ISAIAPIData>, targetTable: Array<ISAIAPIData>) { }
	getByUser(user: IUserData, name: string, table: Array<ISAIAPIData>, targetTable: Array<ISAIAPIData>) { }
	deleteById(id: number, name: string, table: Array<ISAIAPIData>) {

	}

}
