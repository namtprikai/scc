export class Teikeibun {
	Base64 = {
		encode(str: any) {
			return btoa(unescape(encodeURIComponent(str)));
		},
		decode(str: any) {
			return decodeURIComponent(escape(atob(str)));
		},
	};

	private tags = ["[管理者名]"];
	private headers = [""];
	private footers = [""];
	constructor(private axios: any, private productId: string, private adminUserName: string, private FileModule: any) {
		// this.updateTeikeibun();
	}

	get TagListString() {
		return this.tags.join(" ");
	}

	public async updateTeikeibun() {
		try {
			const { data } = await this.axios.get(`https://file.ai-x-supporter.com/${this.productId}/teikeibun.json`, {
				params: {
					h: Date.now(),
				},
			});
			console.log(data);
			// this.$forceUpdate();
			this.headers = data.headers || [""];
			this.footers = data.footers || [""];
		} catch (e) {
			console.log(e);
		}
	}

	private replaceTags(text: string) {
		return text.replace(/\[管理者名\]/g, this.adminUserName);
	}

	get Headers() {
		return ["冒頭に挿入", ...this.headers.map((text: string) => this.replaceTags(text))];
	}

	get Footers() {
		return ["末尾に挿入", ...this.footers.map((text: string) => this.replaceTags(text))];
	}

	add(list: Array<string>) {
		list.push("");
	}

	removeHeader(index: number) {
		this.headers = this.headers.filter((a, i) => i !== index);
	}

	removeFooter(index: number) {
		this.footers = this.footers.filter((a, i) => i !== index);
	}

	addHeader() {
		this.headers.push("");
	}

	addFooter() {
		this.footers.push("");
	}

	setTeikeibun({ headers, footers }: any) {
		this.headers = headers || [""];
		this.footers = footers || [""];
	}

	async upload() {
		const base64Str: string = this.Base64.encode(JSON.stringify({ headers: this.headers, footers: this.footers }));
		await this.FileModule.postFile({
			parent: "",
			fileName: "teikeibun.json",
			type: "list",
			base64Str,
		});
		return { headers: this.headers, footers: this.footers };
	}
}
