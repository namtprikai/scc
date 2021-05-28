<template>
	<div class>
		<b-container v-if="isShow">
			<b-row class="my-1" v-for="item in items" :key="item.id">
				<b-col sm="3">
					<label :for="`type-${item.id}`">{{ item.label }}:</label>
				</b-col>
				<b-col sm="9">
					<!-- <b-form-input :id="`type-${item.id}`" :type="item.type"></b-form-input> -->

					<div v-if="item.dataType == 'displayname'">
						<b-form-input :id="`type-${item.id}`" :type="item.type" v-model="item.model"></b-form-input>
					</div>
					<div v-if="item.dataType == 'attr'">
						<b-form-input :id="`type-${item.id}`" :type="item.type" v-model="attr[item.key]"></b-form-input>
					</div>
					<div v-if="item.dataType == 'tags'">
						<vue-tags-input
							v-model="item.model"
							:tags="item.tags"
							:autocomplete-items="item.autocompleteItems"
							@tags-changed="newTags => (item.tags = newTags)"
							:autocomplete-always-open="item.tags.length < item.maxTag && item.isFocus"
							:add-only-from-autocomplete="true"
							:max-tags="item.maxTag"
							@focus="item.isFocus = true"
							@blur="focusout(item)"
						/>
					</div>
					<div v-if="item.dataType == 'radio'">
						<b-form-group label>
							<b-form-radio-group id="radio-group-1" v-model="item.model" :options="item.radioItems" name="radio-options"></b-form-radio-group>
						</b-form-group>
					</div>
				</b-col>
			</b-row>
			<b-row class="my-1">
				<b-col sm="12">
					<b-button class="mx-auto col-12" v-on:click="userSync()">更新</b-button>
				</b-col>
			</b-row>
		</b-container>
		<wrap-message v-if="!isShow" message="選択してください" />
		<!-- <div class="text-center mb-3 mt-5 justify-content-between" v-else>
      <b-spinner class="ml-auto"></b-spinner>
		</div>-->
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { mapGetters } from 'vuex';
import DashboardParent from '@/views/dashboard/index';
import PanThumb from '@/components/PanThumb/index.vue';
import { PRODUCT_ID } from './../../utils/configration';
import { Ajax } from '@/utils/parts';
import { eventHub } from '@/init/eventHub';
import { AdminUserModule } from '@/store/modules/adminUser';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import { TagService } from '../../services/tag';
import VueTagsInput from '@johmun/vue-tags-input';
import WrapMessage from '@/components/WrapMessage/index.vue';
import UserDetailParent from '@/views/userDetail/index';
// @ts-ignore
@Component({
	components: { VueTagsInput, WrapMessage },
	filters: {
		json: (o: any) => JSON.stringify(o),
	},
})
export default class UserDetail extends Vue {
	private ajax = new Ajax();
	private isShow = false;
	private items: Array<any> = [
		{
			id: '123',
			type: 'text',
			dataType: 'displayname',
			label: 'ユーザー名',
			model: '',
		},
		{
			id: '12453',
			type: 'text',
			dataType: 'attr',
			key: 'birthdayY',
			label: '生年',
			model: '',
		},
		{
			id: '124',
			type: 'select',
			dataType: 'radio',
			category: 'sex',
			label: '性別',
			radioItems: [],
			model: '',
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
			id: '1263',
			type: 'tag',
			dataType: 'tags',
			category: 'store',
			label: '店舗',
			tags: [],
			maxTag: 999,
			autocompleteItems: [],
			model: '',
			isFocus: false,
		},
	];

	public tag = '';
	public tags = [];
	private user: any = null;
	private currentUserTags: Array<any> = [];
	private noEditTags: Array<any> = [];
	private attr: any = {};
	private setUserByMessage(message: any) {
		this.user = message.user;
		try {
			this.attr = JSON.parse(this.user.attribute) || {};
		} catch (e) {
			console.log(e);
		}
		if (this.user.tags) {
			this.currentUserTags = TagService.tagList.getTagsByIds(this.user.tags.map((t: any) => t.user_tag_id));
		}
		this.noEditTags = [];
		console.log(this.currentUserTags);
		let editTags: Array<any> = [];
		if (this.user) {
			for (const item of this.items) {
				if (item.dataType === 'tags') {
					item.tags = this.parseTag(this.currentUserTags.filter((tag: any = {}) => tag.category === item.category));
					editTags = editTags.concat(item.tags.map((t: any) => t.id));
				}
				if (item.dataType === 'radio') {
					item.model = '';
					const tags = this.currentUserTags.filter((tag: any = {}) => tag.category === item.category);
					if (tags && tags.length > 0) {
						console.log(tags);
						item.model = tags[0].id;
						editTags = editTags.concat(tags.map((t: any) => t.id));
					}
				}
				if (item.dataType === 'displayname') {
					console.log(this.user);
					item.model = this.user.displayname;
				}
				if (item.dataType === 'attr') {
					console.log(this.user);
					if (!this.attr.hasOwnProperty(item.key)) {
						this.attr[item.key] = '';
					}
					item.model = this.attr[item.key];
				}
			}
			this.noEditTags = this.currentUserTags.filter((tag: any = {}) => editTags.indexOf(tag.id) === -1).map(t => t.id);
		}
		this.isShow = true;
	}

	public focusout(item: any) {
		setTimeout(() => {
			item.isFocus = false;
		}, 380);
	}

	public getNewTags() {
		let tags: Array<any> = [];
		if (this.user) {
			for (const item of this.items) {
				if (item.dataType === 'tags') {
					tags = tags.concat(item.tags.map((t: any) => t.id));
				}
				if (item.dataType === 'radio' && item.model) {
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
		const attribute = JSON.stringify(this.attr) || '';
		const status = this.user.status;
		this.ajax.http({
			url: `product/${PRODUCT_ID}/user/${id}`,
			method: 'PATCH',
			data: {
				tags,
				status,
				attribute,
				displayname,
			},
		});
	}

	private getTagsByCategory(category: string) {
		return TagService.tagList.getTagsByCategory(category);
	}

	private parseTag(tags: Array<any>): Array<any> {
		return tags.map(tag => Object.assign({ text: tag.name }, tag));
	}

	private parseRadioTag(tags: Array<any>): Array<any> {
		return tags.map(tag => Object.assign({ text: tag.name, value: tag.id }, tag));
	}

	private parseTagToData(tags: Array<any>): Array<any> {
		return tags.map(tag => Object.assign(tag, { name: tag.text }));
	}

	private init() {
		// itemの初期化
		for (const item of this.items) {
			if (item.dataType === 'tags' && item.category) {
				const tags = TagService.tagList.getTagsByCategory(item.category);
				item.autocompleteItems = this.parseTag(tags);
				console.log(item);
			}
			if (item.dataType === 'radio' && item.category) {
				const tags = TagService.tagList.getTagsByCategory(item.category);
				item.radioItems = this.parseRadioTag(tags);
				console.log(item);
			}
		}
	}

	private created() {
		this.init();
		eventHub.$on('setCurrentMessage', this.setUserByMessage);
	}

	private destroyed() {
		eventHub.$off('setCurrentMessage', this.setUserByMessage);
	}
}
</script>

<style lang="scss" scoped>
.role {
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center center;
	width: 150px;
	height: 150px;
	border-radius: 5%;
	margin: 10px auto;
	box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
.dashboard {
	&-container {
		margin: 30px;
	}
	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
.emptyGif {
	display: block;
	width: 45%;
	margin: 0 auto;
}
.dashboard-editor-container {
	background-color: #e3e3e3;
	min-height: 100vh;
	padding: 50px 60px 0px;
	.pan-info-roles {
		font-size: 12px;
		font-weight: 700;
		color: #333;
		display: block;
	}
	.info-container {
		position: relative;
		margin-left: 190px;
		height: 150px;
		line-height: 200px;
		.display_name {
			font-size: 48px;
			line-height: 48px;
			color: #212121;
			position: absolute;
			top: 25px;
		}
	}
}
</style>
