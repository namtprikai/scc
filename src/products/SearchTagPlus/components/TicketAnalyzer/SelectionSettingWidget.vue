<template>
	<b-card no-body>
		<b-card-header>{{ title }}</b-card-header>
		<b-card-body>
			<b-form-checkbox horizontal v-for="item in list" v-model="Select" :key="item.value" :value="item.value" :style="itemStyle">{{ item.text }}</b-form-checkbox>
		</b-card-body>
		<b-card-footer class="text-right">
			<b-button class="mr-2" @click="selectAll" size="sm">全て</b-button>
			<b-button @click="selectNone" size="sm">解除</b-button>
		</b-card-footer>
	</b-card>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
interface ISelectionSettingWidgetListItem {
	text: string;
	value: string;
}
// @ts-ignore
@Component({ name: 'SelectionSettingWidget' })
export default class SelectionSettingWidget extends Vue {
	@Prop({ type: String, default: '' })
	title!: string;

	@Prop({ type: Array })
	list!: ISelectionSettingWidgetListItem[];

	@PropSync('select', { type: Array })
	Select!: string[];

	/* options */
	@Prop({ type: Boolean, default: false })
	all!: boolean;

	@Prop({ type: Boolean, default: false })
	two!: boolean;

	@Prop({ type: Boolean, default: false })
	three!: boolean;

	@Prop({ type: Boolean, default: false })
	wrap!: boolean;

	private created() {
		if (this.all) {
			this.selectAll();
		}
	}

	private selectAll() {
		const select: string[] = [];
		for (const item of this.list) {
			select.push(item.value);
		}
		this.Select = select;
	}

	private selectNone() {
		this.Select = [];
	}

	private get itemStyle() {
		let style = {
			width: '100%',
		};
		if (this.two) {
			style = {
				width: '50%',
			};
		}
		if (this.three) {
			style = {
				width: '33%',
			};
		}
		if (this.wrap) {
			style = { width: 'auto' };
		}
		return style;
	}
}
</script>
<style lang="scss" scoped>
.selection-setting-widget {
	display: flex;
	flex-flow: column nowrap;
	&_title {
		font-weight: 800;
		font-size: 20px;
		line-height: 35px;
		font-family: 'Meiryo Bold';
	}
	&_list {
		flex: 1;
		display: flex;
		flex-flow: row wrap;

		overflow-y: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}
	&_controller {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-end;
		& > * {
			display: inline-block;
			&:nth-child(n + 2) {
				margin-left: 8px;
			}
		}
	}
}
</style>
