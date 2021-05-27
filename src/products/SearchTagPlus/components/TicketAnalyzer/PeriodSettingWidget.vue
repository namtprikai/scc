<template>
	<b-card no-body>
		<b-card-header>期間</b-card-header>
		<b-card-body>
			<div class="period-setting-widget_pickers mb-2">
				<label class="period-setting-widget_pickers__title">集計対象</label>
				<div class="period-setting-widget_pickers__wrapper">
					<el-date-picker picker-options="{lang:'ja'}" v-model="StartDate" type="date" placeholder="集計開始日" class="period-setting-widget_picker" />
					<span class="mx-3">～</span>
					<el-date-picker picker-options="{lang:'ja'}" v-model="EndDate" type="date" placeholder="集計終了日" class="period-setting-widget_picker" />
				</div>
			</div>
			<div class="period-setting-widget_pickers">
				<label class="period-setting-widget_pickers__title">比較対象</label>
				<div class="period-setting-widget_pickers__wrapper">
					<el-date-picker picker-options="{lang:'ja'}" v-model="CStartDate" type="date" placeholder="比較開始日" class="period-setting-widget_picker" />
					<span class="mx-3">～</span>
					<el-date-picker picker-options="{lang:'ja'}" v-model="CEndDate" type="date" placeholder="比較終了日" class="period-setting-widget_picker" />
				</div>
			</div>
		</b-card-body>
		<b-card-footer class="text-right">
			<b-button size="sm" @click="setOneMouth">直近一ヶ月で比較</b-button>
		</b-card-footer>
	</b-card>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
// @ts-ignore
@Component({ name: 'PeriodSettingWidget' })
export default class PeriodSettingWidget extends Vue {
	@PropSync('start_time', { type: Date })
	StartDate!: number;

	@PropSync('end_time', { type: Date })
	EndDate!: number;

	@PropSync('c_start_time', { type: Date })
	CStartDate!: number;

	@PropSync('c_end_time', { type: Date })
	CEndDate!: number;

	@Prop({ type: Boolean, default: false })
	init!: boolean;

	private mounted() {
		if (this.init) {
			this.setOneMouth();
		}
	}

	private async setOneMouth() {
		this.StartDate = this.$moment()
			.subtract(1, 'month')
			.toDate();
		this.EndDate = this.$moment().toDate();
		this.CEndDate = this.$moment()
			.subtract(1, 'month')
			.subtract(1, 'day')
			.toDate();
		this.CStartDate = this.$moment()
			.subtract(2, 'month')
			.subtract(1, 'day')
			.toDate();
	}
}
</script>
<style lang="scss" scoped>
// .period-setting-widget {
// 	display: flex;
// 	flex-flow: column nowrap;
// 	justify-content: space-between;
// 	&_title {
// 		font-weight: 800;
// 		font-size: 20px;
// 		line-height: 35px;
// 		font-family: "Meiryo Bold";
// 	}
// 	&_pickers {
// 		display: flex;
// 		flex-flow: row nowrap;
// 		align-items: center;
// 		&:nth-child(n + 2) {
// 			margin-top: 16px;
// 		}
// 		&__title {
// 			width: 80px;
// 			font-size: 14px;
// 			font-family: "Meiryo";
// 			line-height: 30px;
// 		}
// 		&__wrapper {
// 			display: flex;
// 			flex-flow: row nowrap;
// 			align-items: center;
// 			flex: 1;
// 		}
// 	}
// 	&_picker {
// 		flex: 1;
// 	}
// 	&_buttons {
// 		display: flex;
// 		flex-flow: row-reverse wrap;
// 	}
// }
</style>
