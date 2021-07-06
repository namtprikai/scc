export class CSVFact {
	constructor(private csv = "", private newLineFlag = true) {}

	public get CSV(): string {
		return this.csv;
	}

	public newLine(): void {
		this.csv += "\n";
		this.newLineFlag = true;
	}

	public addText(text: string): void {
		this.addComma();
		this.csv += `"${text}"`;
	}

	public addNumber(number: number): void {
		this.addComma();
		this.csv += `${number !== Infinity ? number : "-"}`;
	}

	private addComma(): boolean {
		if (!this.newLineFlag) {
			this.csv += ",";
			return true;
		} else {
			this.newLineFlag = false;
			return false;
		}
	}
}

export type ICSVHeader = ICSVHeaderItem[];

export interface ICSVHeaderItem {
	label: string;
	field: string;
	type: "text" | "number";
	index?: number;
}

export class CSVFactPlus {
	constructor(private header: ICSVHeader, private rows: any[]) {}

	public getCSV(): string {
		let csv = "";
		csv += this.createHeader();
		const cf = new CSVFact();
		for (let i = 0; i < this.rows.length; i++) {
			const row = this.rows[i];
			for (let q = 0; q < this.header.length; q++) {
				const hi = this.header[q];
				switch (hi.type) {
					case "text":
						cf.addText(row[hi.field] ?? "");
						break;
					case "number":
						cf.addNumber(
							hi?.index !== undefined ? row[hi.field][hi.index] : row[hi.field]
						);
						break;
				}
			}
			cf.newLine();
		}
		csv += cf.CSV;
		return csv;
	}

	private createHeader(): string {
		const cf = new CSVFact();
		for (let i = 0; i < this.header.length; i++) {
			const item = this.header[i];
			cf.addText(item.label);
		}
		cf.newLine();
		return cf.CSV;
	}
}
