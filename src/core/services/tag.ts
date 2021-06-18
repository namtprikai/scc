import store from '../store/index';
import { inherits } from 'util';
import { MessageListModule } from '../store/modules/messageList';
import { UserModule } from '@/store/modules/user';
import io from 'socket.io-client';
import { Auth } from '@/utils/auth';
import { apiUrl, CLIENT_ID } from '@consoletype/utils/configration';
import { Ajax } from '@/utils/parts';
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
			return this._tags.find(tag => tag.id === id);
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
			console.info('setTags');
			this._tags = [];
			for (let i = 0; i < tags.length; i++) {
				this._tags.push(new Tag(tags[i]));
			}
			// カテゴリー設定
			this.setCategory();
			this.trigger('ready');
		}

		private setCategory(tags: Array<Tag> | null = null) {
			console.log('setCategory');
			if (tags == null) {
				for (let i = 0; i < this._tags.length; i++) {
					if (this._tags[i].is_category() == false && this._tags[i].parent != null) {
						const parentTags: any = this._tags[i].parent;
						console.log(this._tags.find((tag: Tag) => tag.id == this._tags[i].parent));
						if (this._tags.find((tag: Tag) => tag.id == this._tags[i].parent) != null) {
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

	}
}
