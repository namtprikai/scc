import store from "../store/index";
import { inherits } from "util";
import { MessageListModule } from "@/store/modules/messageList";
import { UserModule } from "@/store/modules/user";
import io from "socket.io-client";
import { Auth } from "@/utils/auth";
import { apiUrl, CLIENT_ID } from "../utils/configration";
import { Ajax } from "@/utils/parts";
export namespace TagService {
	export class Tag {
		public id: string | null = null;
		public category: string | null = null;
		public name: string | null = null;
		public parent: string | null = null;
		constructor(tag: any) {
			if (tag != null) {
				this.id = tag.id;
				this.name = tag.name;
				this.parent = tag.parent;
				this.category = tag.category || null;
			}
		}

		public is_category(): boolean {
			return this.category !== null;
		}

		get text() {
			return this.name;
		}

		set text(text) {
			this.name = text;
		}
	}
	export class TagList {
		private _tags: Array<Tag> = [];
		private _readyCallbacks: Array<any> = [];
		constructor(tags?: Array<Tag>) {
			if (tags != null) {
				this.setTags(tags);
			}
		}

		getTagById(id: string): Tag | undefined {
			return this._tags.find((tag) => tag.id === id);
		}

		getTagsByIds(ids: Array<string> = []): Array<Tag> {
			const tags: Array<Tag> = [];
			for (let i = 0; i < ids.length; i++) {
				const tag = this.getTagById(ids[i]);
				if (tag != null) {
					tags.push(tag);
				}
			}
			return tags;
		}

		public trigger(eventName: string, obj?: Object) {
			// Broadcaster.getInstance().trigger(eventName, obj)
		}

		public setTags(tags: Array<Tag>): void {
			console.info("setTags");
			this._tags = [];
			for (let i = 0; i < tags.length; i++) {
				this._tags.push(new Tag(tags[i]));
			}
			// カテゴリー設定
			this.setCategory();
			this.trigger("ready");
		}

		private setCategory(tags: Array<Tag> | null = null) {
			console.log("setCategory");
			if (tags == null) {
				for (let i = 0; i < this._tags.length; i++) {
					if (this._tags[i].is_category() == false && this._tags[i].parent != null) {
						const parentTags: any = this._tags[i].parent;
						console.log(
							this._tags.find((tag: Tag) => tag.id == this._tags[i].parent)
						);
						if (
							this._tags.find((tag: Tag) => tag.id == this._tags[i].parent) != null
						) {
							this._tags[i].category = (
								this._tags.find((tag: Tag) => tag.id === parentTags) || {
									name: null,
								}
							).name;
						}
					}
				}
			}
		}

		public addCategory(tags: Array<Tag> | null = null): Array<Tag> | null {
			if (tags !== null) {
				for (let i = 0; i < tags.length; i++) {
					if (tags[i].is_category() == false && tags[i].parent != null) {
						console.log(tags.find((tag: Tag) => tag.id == tags[i].parent));
						if (tags.find((tag: Tag) => tag.id == tags[i].parent) != null) {
							tags[i].category = (
								this._tags.find((tag: Tag) => tag.id == tags[i].parent) || {
									name: null,
								}
							).name;
						}
					}
				}
			}
			return tags;
		}

		public conveartCategory() {}
		// ＠Function 状態変化なし
		public extendTags(
			oldTags: Array<Tag> | null,
			tags: Array<Tag> | null
		): Array<Tag> {
			tags = this.addCategory(tags);
			oldTags = this.addCategory(oldTags);
			const flg = false;
			// let oldTags:Array<Tag>=this._tags;
			const oldTagCategorys: Array<string> = [];
			let nowTagCategorys: Array<string> = [];
			const oldTagMap: { [key: string]: any } = {};
			const nowTagMap: any = {};
			let newTags: any = [];
			// let returnTags: TagList = null;
			if (oldTags !== null) {
				// 現状のタグのカテゴリ名セットを作る
				for (let i = 0; i < oldTags.length; i++) {
					const category: any = oldTags[i].category;
					if (oldTagCategorys.indexOf(category) === -1) {
						oldTagCategorys.push(category);
						// oldTagMap[oldTags[i].category]=oldTags[i];
					}
					if (category in oldTagMap) {
						oldTagMap[category].push(oldTags[i]);
					} else {
						oldTagMap[category] = [];
						oldTagMap[category].push(oldTags[i]);
					}
				}
				// 現状タグのカテゴリ名セットを作る
				if (tags) {
					for (let i = 0; i < tags.length; i++) {
						if (tags[i] == null) {
							continue;
						}
						const category: any = oldTags[i].category;
						nowTagCategorys = nowTagCategorys.filter((tag: any) => {
							if (tags) {
								return tag.category === tags[i].category;
							}
							return false;
						});
						if (category in nowTagMap) {
							nowTagMap[category].push(tags[i]);
						} else {
							nowTagMap[category] = [];
							nowTagMap[category].push(tags[i]);
						}
					}
				}
			}

			// console.log(newTags);
			for (const oldTagKey in oldTagMap) {
				// 編集可能タグ
				// if (this.editTags.indexOf(oldTagKey) !== -1) {
				if (oldTagKey in nowTagMap) {
					newTags = newTags.concat(nowTagMap[oldTagKey]);
				} else {
					// newTags=newTags.concat(oldTagMap[oldTagKey]);
				}
				// 編集不可能タグ
				// }
				//  else {
				// 	newTags = newTags.concat(oldTagMap[oldTagKey]);
				// }
			}
			// console.log(newTags);
			// 次に編集可能タグで、しかも新規追加されたものを加える
			for (const nowTagKey in nowTagMap) {
				if (!(nowTagKey in oldTagMap)) {
					newTags = newTags.concat(nowTagMap[nowTagKey]);
				}
			}
			return newTags.filter((tag: any) => tag.id != null);
		}

		public updateTags(tags: Array<Tag>): TagList {
			const flg = false;
			const oldTags: Array<Tag> = this._tags;
			const oldTagCategorys: Array<string> = [];
			let nowTagCategorys: Array<string> = [];
			const oldTagMap: { [key: string]: any } = {};
			const nowTagMap: any = {};
			let newTags: any = [];

			// 現状のタグのカテゴリ名セットを作る
			for (let i = 0; i < oldTags.length; i++) {
				if ("category" in oldTags[i]) {
					const category: any = oldTags[i].category;
					if (oldTagCategorys.indexOf(category) === -1) {
						oldTagCategorys.push(category);
						// oldTagMap[oldTags[i].category]=oldTags[i];
					}
					if (category in oldTagMap) {
						oldTagMap[category].push(oldTags[i]);
					} else {
						oldTagMap[category] = [];
						oldTagMap[category].push(oldTags[i]);
					}
				}
			}
			// 現状タグのカテゴリ名セットを作る
			for (let i = 0; i < tags.length; i++) {
				if (tags[i] == null) {
					continue;
				}
				nowTagCategorys = nowTagCategorys.filter(
					(tag: any) => tag.category === tags[i].category
				);
				const category: any = oldTags[i].category;
				if (category in nowTagMap) {
					nowTagMap[category].push(tags[i]);
				} else {
					nowTagMap[category] = [];
					nowTagMap[category].push(tags[i]);
				}
			}
			// console.log(newTags);
			for (const oldTagKey in oldTagMap) {
				// 編集可能タグ
				// if (this.editTags.indexOf(oldTagKey) !== -1) {
				if (oldTagKey in nowTagMap) {
					newTags = newTags.concat(nowTagMap[oldTagKey]);
				} else {
					newTags = newTags.concat(oldTagMap[oldTagKey]);
				}
				// 編集不可能タグ
				// } else {
				// newTags = newTags.concat(oldTagMap[oldTagKey]);
				// }
			}
			// console.log(newTags);
			// 次に編集可能タグで、しかも新規追加されたものを加える
			for (const nowTagKey in nowTagMap) {
				// if (this.editTags.indexOf(nowTagKey) !== -1) {
				if (nowTagKey in oldTagMap) {
				} else {
					newTags = newTags.concat(nowTagMap[nowTagKey]);
				}
				// }
			}
			this._tags = newTags.filter((tag: any) => tag.id != null);
			console.log(this._tags);
			return this;
		}

		getTagsByCategory(category: string | Array<string>): Array<Tag> | any {
			const tags = [];
			for (let i = 0; i < this._tags.length; i++) {
				if (typeof category === "string") {
					if (this._tags[i].category === category) {
						tags.push(this._tags[i]);
					}
				} else {
					const category = this._tags[i].category;
					if (category && category.indexOf(category) !== -1) {
						tags.push(this._tags[i]);
					}
				}
			}
			return tags;
		}
	}
	export const tagList = new TagList();
	const ajax = new Ajax();
	let isInit = false;
	export async function init() {
		console.log("init");
		// if (isInit) {
		// 	return;
		// }
		isInit = true;
	}
}
