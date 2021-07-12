import { ISAIAPIData, IAdminData, IUserData } from '../src/core/api/types';
export function getId(rows: Array<{ id: number, [key: string]: any }>) {
	let maxId = 0;
	for (const row of rows) {
		maxId = Math.max(row.id, maxId);
	}
	return (maxId += 1);
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
	getByAdmin(admin: IAdminData) { }
	getByUser(user: IUserData) { }
	deleteById(id: number, name: string, table: Array<ISAIAPIData>) {

	}

}
