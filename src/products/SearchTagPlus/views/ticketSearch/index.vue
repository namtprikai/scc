<template>
	<b-container style="position: relative">
		<b-row class="mb-2">
			<b-col lg="6">
				<el-date-picker picker-options="{lang:'ja'}" v-model="startdate" type="date" placeholder="Pick a date" style="width: 100%" />
			</b-col>
			<b-col lg="6">
				<el-date-picker picker-options="{lang:'ja'}" v-model="enddate" type="date" placeholder="Pick a date" style="width: 100%" />
			</b-col>
		</b-row>

		<b-row class="mb-2">
			<b-col lg="12" class="pb-2 text-center">
				<b-button v-on:click="_search()">検索</b-button>
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="6">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="hourlyTicketCounts" width="100%" height="400px" titleText="時間帯別チケット件数" valueUnit="件" />
			</b-col>
			<b-col lg="6">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="dailyTicketCounts" width="100%" height="400px" titleText="日別チケット件数" valueUnit="件" />
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="6">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="weeklyTicketCounts" width="100%" height="400px" titleText="曜日別チケット件数" valueUnit="件" />
			</b-col>
			<b-col lg="6">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="monthlyTicketCounts" width="100%" height="400px" titleText="月別チケット件数" valueUnit="件" />
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="6">
				<pieChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="statusCounts" width="100%" height="400px" titleText="ステータス" valueUnit="件" />
			</b-col>
			<b-col lg="6">
				<pieChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="answeredCounts" width="100%" height="400px" titleText="回答済み" valueUnit="件" />
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="6">
				<pieChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="enquete1Counts" width="100%" height="400px" titleText="アンケート1回答結果" valueUnit="件" />
			</b-col>
			<b-col lg="6">
				<pieChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="enquete2Counts" width="100%" height="400px" titleText="アンケート2回答結果" valueUnit="件" />
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="12">
				<paretoChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="faqCounts" width="100%" height="800px" titleText="FAQ別グラフ" valueUnit="件" xLabelAll="true" />
			</b-col>
		</b-row>
<!--
		<b-row>
			<b-col lg="12">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="operatorCounts" width="100%" height="400px" titleText="対応者担当別グラフ" valueUnit="件" xLabelAll="true" />
			</b-col>
		</b-row> -->

		<b-row>
			<b-col lg="6">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="modeCounts" width="100%" height="400px" titleText="手段別対応件数" valueUnit="件" />
			</b-col>

			<b-col lg="6">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="durationCounts" width="100%" height="400px" titleText="経過時間別グラフ" valueUnit="件" />
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="12">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="parentCategoryCounts" width="100%" height="400px" titleText="親カテゴリ別件数" valueUnit="件" xLabelAll="true" />
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="12">
				<barChart class="mx-auto my-2" v-loading="listLoading" v-bind:data="childCategoryCounts" width="100%" height="400px" titleText="子カテゴリ別件数" valueUnit="件" xLabelAll="true" />
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Pie from '@/components/Charts/Pie.vue';
import Bar from '@/components/Charts/Bar.vue';
import Pareto from '@/components/Charts/Pareto.vue';
import _ from 'lodash';
import moment, { duration } from 'moment';
import TicketSearchParent from '@/views/ticketSearch';

// @ts-ignore
@Component({
	components: { PieChart: Pie, BarChart: Bar, ParetoChart: Pareto },
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
		dateJa(time: string) {
			return new Date(parseInt(time));
		},
	},
})
export default class TicketSearch extends TicketSearchParent {
	private answeredCounts: any[] = [];
	constructor() {
		super();
	}

	private async _search() {
		await this.search();
		this.answeredCounts = this.updateAnsweredCounts(this.tickets);
	}

	private updateAnsweredCounts(tickets: any[]) {
		if (!tickets || tickets.length <= 0) {
			return [];
		}

		const groupByFeedback = _.chain(tickets)
			.filter(t => t.feedback)
			.groupBy(t => t.feedback);
		return groupByFeedback
			.keys()
			.map(k => ({
				name: k,
				value: groupByFeedback
					.get(k)
					.size()
					.value(),
			}))
			.value();
	}
}
</script>

<style type="sass" scoped>
.table-wrapper {
	max-height: 50vh;
	height: 100%;
	overflow-y: scroll;
}
</style>
