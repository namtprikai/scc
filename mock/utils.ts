import { ISAIAPIData, IAdminData, IUserData, ICrossReferenceTable } from '../src/core/api/types';
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

	constructor(protected table: Array<T>,private url:string, protected modelAdmin: ProductRoleFilter<T>, protected modelUser?: RoleFilter<T>) { }
	public add(data: any) {
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
			const isWhite = this.modelAdmin.isWhite(admin, row,this.url,"delete");
			if (isWhite) {
				this.table = this.table.filter(r => r.id !== id);
			} else {
				throw "権限エラー";
			}
		}
		throw "not found"
	}
	getListByAdmin(admin: IAdminData) {
		return this.modelAdmin.getData(admin,this.url,"get");
	}
	getListByUser(user: IUserData) {
		return this.modelUser?.getData(user)||[];
	}
}
export class CrossReferenceTable<T extends ICrossReferenceTable> {
	constructor(protected aName: string, protected bName: string) {

	}
	get AName(){
		return this.aName;
	}
	get BName(){
		return this.bName;
	}
	protected getMaxId(table: Array<ISAIAPIData>) {
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
	protected getBByA(id: number, table: Array<T>): Array<number> {
		return table.filter(t => t[this.aName] === id)
		.map(t =>{
			let ret: number = 0;
			const bId = t[this.bName];
			if(typeof bId === 'string'){
				ret = parseInt(bId,10);
			}else{
				ret = bId;
			}
			return ret;
		});
	}
	protected getAByB(id: number, table: Array<T>): Array<number> {
		return table.filter(t => t[this.bName] === id).map(t => {
			let ret: number = 0;
			const aId = t[this.aName];
			if(typeof aId === 'string'){
				ret = parseInt(aId,10);
			}else{
				ret = aId;
			}
			return ret;
		});
	}
	protected getAByBAdmin<H extends ISAIAPIData>(admin: IAdminData, id: number, table: Array<T>, targetModel: SAITableModel<H>) {
		const idSet = new Set(this.getAByB(id, table));
		return targetModel.getListByAdmin(admin).filter(t => idSet.has(t.id));
	}
	protected getBByAAdmin<H extends ISAIAPIData>(admin: IAdminData, id: number, table: Array<T>, targetModel: SAITableModel<H>) {
		const idSet = new Set(this.getBByA(id, table));
		return targetModel.getListByAdmin(admin).filter(t => idSet.has(t.id));
	}
	protected getAByBUser<H extends ISAIAPIData>(admin: IAdminData, id: number, table: Array<T>, targetModel: SAITableModel<H>) {
		const idSet = new Set(this.getAByB(id, table));
		return targetModel.getListByUser(admin).filter(t => idSet.has(t.id));
	}
	protected deleteByAId( id: number, table: Array<T>) {
		table = table.filter(t=>t[this.aName]!==id);
	}
	protected deleteByBId( id: number, table: Array<T>) {
		table = table.filter(t=>t[this.bName]!==id);
	}
	public deleteByABId( aid: number,bid: number, table: Array<T>) {
		table = table.filter(t=>t[this.bName]!==bid&&t[this.aName]!==aid);
	}
}
