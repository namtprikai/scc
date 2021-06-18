<template>
	<div class="box" v-bind:style="{ height: Height }">
		<el-tabs v-model="activeName" style="margin-top: 0px" type="border-card" @tab-click="tabclick" @handleTabClick="tabclick">
			<el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
				<!-- <keep-alive> -->
				<!-- <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes"/> -->
				<!-- <div class="panelWrap" v-bind:style="{height:windowHeight+'px'}"> -->
				<div class="panelWrap" v-bind:style="{ height: PanelHeight }" v-bind:id="item.key" v-if="activeName == item.key || item.all">
					<panels :component="item.component || item.key" :defaultpanel="Defaultpanel" :height="PanelHeight" :discription="item.discription" :tabtype="item.tabtype" />
				</div>

				<!-- </keep-alive> -->
			</el-tab-pane>
		</el-tabs>
		<!-- <router-view name="v1"/> -->
		<!-- フレームモーダル置き場 -->
		<div v-if="modalOpen">
			<Modal v-if="modalOpen === 'MediaList'">
				<MediaList />
			</Modal>
		</div>
		<!-- フレームモーダル置き場 -->
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Panels from '@consoletype/panels.vue';
import { eventHub } from '@/init/eventHub';
import { UserModule } from '@/store/modules/user';
import MediaList from '@consoletype/views/mediaList/modal.vue';
import Modal from '@/components/ModalComp/index.vue';
// @ts-ignore
@Component({
	components: {
		Panels,
		Modal,
		MediaList,
	},
})
export default class Box extends Vue {
	private headerHeight = 50;
	private tabHeight = 30;

	private params?: any;
	@Prop({ default: 'auto' })
	height?: string;

	private modalOpen: false | string = false;
	// @Prop({ default: "Tree" })
	private defaultpanel?: any;
	private activeName = 'Tree';
	private tabMapOptions = [
		{ label: 'Default', key: 'MessageList' },
		{ label: 'Default2', key: 'Tree' },
		// { label: "Japan", key: "JP" },
		// { label: "Eurozone", key: "EU" }
	];

	get Height() {
		return 'auto';
		// if (this.height === "auto" || this.height === undefined) {
		// 	return "auto";
		// }
		// // tslint:disable-next-line:radix
		// return parseInt(this.height) + 30 + "px";
	}

	get PanelHeight() {
		if (this.height === undefined) {
			this.height = String(window.innerHeight);
		}
		return `calc(100vh - ${this.tabHeight + this.headerHeight + 6}px)`;
		// return parseInt(this.height) - this.tabHeight + 40 + "px";
	}

	tabclick(e: any) {
		console.log('tabclick');
		console.log(e);
		eventHub.$emit('tabclick', e.name);
	}

	setTabs() {
		console.log('setTabs');
		if (!this.$attrs['data-name'] || (!this.$route.meta && this.$attrs['data-name'] in this.$route.meta)) {
			return;
		}
		try {
			const tabMapOptions = this.$route.meta[this.$attrs['data-name']].tabs || [];
			this.tabMapOptions = tabMapOptions.filter((tab: any) => {
				if (tab.roles) {
					if (!tab.roles.find((r:number)=>UserModule.Role.has(r))) {
						return false;
					}
				}
				return true;
			});
			console.log('created');
			this.Defaultpanel = this.activeName = this.$route.meta[this.$attrs['data-name']].default;
		} catch (e) {
			console.log(e);
		}

		this.$forceUpdate();
	}

	created() {
		this.$router.afterEach(() => {
			this.setTabs();
		});
		this.setTabs();
		window.addEventListener('resize', this.resizeHandler);
		this.resizeHandler();
		console.log(this.height);
		eventHub.$on('BoxModalOpen', this.ModalOpen);
		eventHub.$on('BoxModalClose', this.ModalClose);
	}

	set Defaultpanel(name: string) {
		this.defaultpanel = name;
	}

	get Defaultpanel() {
		return this.defaultpanel || '';
	}

	public ModalOpen(type: string, param?: any) {
		this.modalOpen = type;
		this.params = param;
	}

	public ModalClose() {
		this.modalOpen = false;
	}

	resizeId: number | null = null;
	windowHeight = 1000;
	destroyed() {
		eventHub.$off('BoxModalOpen', this.ModalOpen);
		eventHub.$off('BoxModalClose', this.ModalClose);
		window.removeEventListener('resize', this.resizeHandler);
	}

	resizeHandler() {
		if (this.resizeId !== null) {
			window.clearTimeout(this.resizeId);
		}
		this.resizeId = window.setTimeout(this.doResize, 400);
	}

	doResize() {
		this.windowHeight = window.innerHeight;
	}
}
</script>

<style type="scss" lang="scss">
.relative {
	display: block;
	position: relative;
}
.panelWrap {
	overflow: auto;
	will-change: transform;
	width: 100%;
	height: auto;
}
.box {
	overflow: auto;
	// will-change: transform;
}
.box {
	.el-tabs__content {
		padding: 0px !important;
	}
}
/* .flame {
	width: 300px;
	height: 300px;
} */
</style>
