export function getId(rows: Array<{id:number,[key:string]:any}>) {
	let maxId = 0;
	for (const row of rows) {
		maxId = Math.max(row.id, maxId);
	}
	return (maxId += 1);
}
