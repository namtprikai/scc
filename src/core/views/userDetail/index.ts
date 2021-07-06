import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/modules/user";
import { mapGetters } from "vuex";
import DashboardParent from "@/views/dashboard/index";
import PanThumb from "@/components/PanThumb/index.vue";
import { CLIENT_ID } from "@consoletype/utils/configration";
import { Ajax } from "@/utils/parts";
import { eventHub } from "@/init/eventHub";
import { AdminUserModule } from "@/store/modules/adminUser";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import { TagService } from "@/services/tag";
import VueTagsInput from "@johmun/vue-tags-input";
import WrapMessage from "@/components/WrapMessage/index.vue";
// @ts-ignore
@Component({
	components: { VueTagsInput, WrapMessage },
	filters: {
		json: (o: any) => JSON.stringify(o),
	},
})
export default class UserDetailParent extends Vue {
	private ajax = new Ajax();
	private isShow = false;
	private items: Array<any> = [
		{
			id: "123",
			type: "text",
			dataType: "displayname",
			label: "ユーザー名",
			model: "",
		},
		{
			id: "12453",
			type: "text",
			dataType: "attr",
			key: "birthdayY",
			label: "生年",
			model: "",
		},
		{
			id: "124",
			type: "select",
			dataType: "radio",
			category: "sex",
			label: "性別",
			radioItems: [],
			model: "",
		},
		// {
		// 	id: "126",
		// 	type: "tag",
		// 	dataType: "tags",
		// 	category: "customer_category",
		// 	label: "顧客属性",
		// 	tags: [],
		// 	maxTag: 1,
		// 	autocompleteItems: [],
		// 	model: "",
		// 	isFocus: false
		// },
		{
			id: "1263",
			type: "tag",
			dataType: "tags",
			category: "store",
			label: "店舗",
			tags: [],
			maxTag: 999,
			autocompleteItems: [],
			model: "",
			isFocus: false,
		},
	];

	tag = "";
	tags = [];
	private user: any = null;
	private currentUserTags: Array<any> = [];
	private noEditTags: Array<any> = [];
	private attr: any = {};
	private setUserByUser(user: any) {
		this.user = user;
		try {
			this.attr = JSON.parse(this.user.attribute) || {};
		} catch (e) {
			console.log(e);
		}
		if (this.user.tags) {
			// this.currentUserTags = TagService.tagList.getTagsByIds(this.user.tags.map((t: any) => t.user_tag_id));
		}
		this.noEditTags = [];
		console.log(this.currentUserTags);
		let editTags: Array<any> = [];
		if (this.user) {
			for (const item of this.items) {
				if (item.dataType === "tags") {
					item.tags = this.parseTag(this.currentUserTags.filter((tag: any = {}) => tag.category === item.category));
					editTags = editTags.concat(item.tags.map((t: any) => t.id));
				}
				if (item.dataType === "radio") {
					item.model = "";
					const tags = this.currentUserTags.filter((tag: any = {}) => tag.category === item.category);
					if (tags && tags.length > 0) {
						console.log(tags);
						item.model = tags[0].id;
						editTags = editTags.concat(tags.map((t: any) => t.id));
					}
				}
				if (item.dataType === "displayname") {
					console.log(this.user);
					item.model = this.user.displayname;
				}
				if (item.dataType === "attr") {
					console.log(this.user);
					if (!this.attr.hasOwnProperty(item.key)) {
						this.attr[item.key] = "";
					}
					item.model = this.attr[item.key];
				}
			}
			this.noEditTags = this.currentUserTags.filter((tag: any = {}) => editTags.indexOf(tag.id) === -1).map((t) => t.id);
		}
		this.isShow = true;
	}

	private setUserByMessage(message: any) {
		this.user = message.user;
		try {
			this.attr = JSON.parse(this.user.attribute) || {};
		} catch (e) {
			console.log(e);
		}
		if (this.user.tags) {
			// this.currentUserTags = TagService.tagList.getTagsByIds(this.user.tags.map((t: any) => t.user_tag_id));
		}
		this.noEditTags = [];
		console.log(this.currentUserTags);
		let editTags: Array<any> = [];
		if (this.user) {
			for (const item of this.items) {
				if (item.dataType === "tags") {
					item.tags = this.parseTag(this.currentUserTags.filter((tag: any = {}) => tag.category === item.category));
					editTags = editTags.concat(item.tags.map((t: any) => t.id));
				}
				if (item.dataType === "radio") {
					item.model = "";
					const tags = this.currentUserTags.filter((tag: any = {}) => tag.category === item.category);
					if (tags && tags.length > 0) {
						console.log(tags);
						item.model = tags[0].id;
						editTags = editTags.concat(tags.map((t: any) => t.id));
					}
				}
				if (item.dataType === "displayname") {
					console.log(this.user);
					item.model = this.user.displayname;
				}
				if (item.dataType === "attr") {
					console.log(this.user);
					if (!this.attr.hasOwnProperty(item.key)) {
						this.attr[item.key] = "";
					}
					item.model = this.attr[item.key];
				}
			}
			this.noEditTags = this.currentUserTags.filter((tag: any = {}) => editTags.indexOf(tag.id) === -1).map((t) => t.id);
		}
		this.isShow = true;
	}

	focusout(item: any) {
		setTimeout(() => {
			item.isFocus = false;
		}, 380);
	}

	getNewTags() {
		let tags: Array<any> = [];
		if (this.user) {
			for (const item of this.items) {
				if (item.dataType === "tags") {
					tags = tags.concat(item.tags.map((t: any) => t.id));
				}
				if (item.dataType === "radio" && item.model) {
					tags = tags.concat([item.model]);
				}
			}
			tags = tags.concat(this.noEditTags);
		}
		return tags;
	}

	private async userSync() {
		const id = this.user.id;
		const tags = this.getNewTags();
		const displayname = this.user.displayname;
		const attribute = JSON.stringify(this.attr) || "";
		const status = this.user.status;
		this.ajax.http({
			url: `product/${CLIENT_ID}/user/${id}`,
			method: "PATCH",
			data: {
				tags,
				status,
				attribute,
				displayname,
			},
		});
	}

	private parseTag(tags: Array<any>): Array<any> {
		return tags.map((tag) => Object.assign({ text: tag.name }, tag));
	}

	private parseRadioTag(tags: Array<any>): Array<any> {
		return tags.map((tag) => Object.assign({ text: tag.name, value: tag.id }, tag));
	}

	private parseTagToData(tags: Array<any>): Array<any> {
		return tags.map((tag) => Object.assign(tag, { name: tag.text }));
	}

	private init() {
		// itemの初期化
	}

	private created() {
		this.init();
		eventHub.$on("setCurrentMessage", this.setUserByMessage);
		eventHub.$on("setCurrentUser", this.setUserByUser);
	}

	private destroyed() {
		eventHub.$off("setCurrentMessage", this.setUserByMessage);
		eventHub.$off("setCurrentUser", this.setUserByUser);
	}
}
