<template>
	<div class="aggregate-results-table-sub">
		<vue-good-table class="vgt" :style="{ width: tableWidth }" v-for="(data, i) in tableData" :key="i" :rows="data.rows" :columns="data.columns" :max-height="tableHeight" :fixed-header="true" />
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TalkScript as ITalkScript } from '@/store/modules/talkScript';
import { IVueGoodTableColumn } from './index.i';
import _ from 'lodash';

interface ITableData {
	rows: any[];
	columns: IVueGoodTableColumn[];
}

// @ts-ignore
@Component({ name: 'AggregateResultsTableSub' })
export default class AggregateResultsTableSub extends Vue {
	@Prop({ type: Array, default: [] })
	ts!: ITalkScript[];

	@Prop({ type: Array, default: [] })
	tickets!: any[];

	@Prop({ type: Array, default: [] })
	ctickets!: any[];

	@Prop({ type: String, default: '-' })
	defaultNoneText!: string;

	@Prop({ type: String, default: '400px' })
	tableHeight!: string;

	@Prop({ type: String, default: '33%' })
	tableWidth!: string;

	private tableData: ITableData[] = [];

	private searchStatuses: {
		[key: string]: { label: string; field: string };
	} = {
		answered: { field: 'answered', label: '回答済み' },
    answering: { field: "answering", label: "回答閲覧中" },
		searchFailed: { field: 'searchFailed', label: '検索失敗' },
		scriptNotFound: { field: 'scriptNotFound', label: '未収録' },
		quit: { field: 'quit', label: '未完了' },
		're-search': { field: 're-search', label: '再検索' },
		open: { field: 'open', label: '離脱' },
	};

	public created() {
		this.updateTableData();
	}

	@Watch('tickets')
	private updateTableData() {
		if (this.tickets.length > 0) {
			const statusTable = this.createTable(
				'ステータス',
				this.tickets,
				this.ctickets,
				this.searchStatuses,
				(v: any) => v.status,
				(v: any) => v.status,
			);
			// const searchRouteTable = this.createTable("検索経路",this.tickets,this.ctickets,[{field:""}])
			const feedbackTable = this.createTable(
				'フィードバック結果',
				this.tickets,
				this.ctickets,
				{
					resolved: { field: 'resolved', label: '解決' },
					unresolved: { field: 'unresolved', label: '未解決' },
					undefined: { field: 'undefined', label: 'なし' },
				},
				(v: any) => v.status === 'answered',
				(v: any) => {
					if (v.feedback) return v.feedback;
					return 'undefined';
				},
			);
			this.tableData = [statusTable, feedbackTable];
			const rowsGroup = {
				status: statusTable.rows,
				feedback: feedbackTable.rows,
			};
			this.$emit('update', rowsGroup);
		}
	}

	private createTable(title: string, seed: any[], cseed: any[], keys: { [key: string]: { label: string; field: string } }, filterCb: Function, groupCb: Function, defaultNoneText = '-'): ITableData {
		const columns: IVueGoodTableColumn[] = [
			{ label: title, field: 'status', width: '34%' },
			{
				label: '件数',
				field: 'count',
				sortFn: (a: number[], b: number[]) => (a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1),
				formatFn: (a: number[]) => a[0],
				width: '22%',
			},
			{
				label: '全体を占める割合',
				field: 'count_per',
				formatFn: (v: number): string => `${Math.floor(v * 10000) / 100}%`,
				width: '22%',
			},
			{
				label: '増減率',
				field: 'count_id',
				formatFn: (v: number): string => {
					if (typeof v !== 'number' || v == Infinity || v == null || !/\d/.test(String(v))) {
						return defaultNoneText;
					}
					return `${Math.floor(v * 10000) / 100}%`;
				},
				width: '22%',
			},
		];

		const filterdItem = _(seed)
			.chain()
			.filter(v => filterCb(v))
			.value();
		const filterdCItem = _(cseed)
			.chain()
			.filter(v => filterCb(v))
			.value();

		const group = _(filterdItem)
			.chain()
			.groupBy(v => groupCb(v));
		const cgroup = _(filterdCItem)
			.chain()
			.groupBy(v => groupCb(v));

		const TOTAL_COUNT = filterdItem.length;
		const rows = _(keys)
			.chain()
			.map(v => {
				const data = group.get(v.field);
				const cdata = cgroup.get(v.field);
				const COUNT = data.size().value() ?? 0;
				const C_COUNT = cdata.size().value() ?? 0;
				const COUNT_PER = COUNT / TOTAL_COUNT || 0;
				const COUNT_ID = COUNT / C_COUNT - 1;
				return {
					status: v.label,
					count: [COUNT, COUNT - C_COUNT],
					count_per: COUNT_PER,
					count_id: COUNT_ID,
				};
			})
			.value();

		return { columns: columns, rows: rows };
	}
}
</script>
<style lang="scss" scoped>
.aggregate-results-table-sub {
	display: flex;
	flex-flow: row wrap;
	.vgt {
		&:nth-child(n + 2) {
			margin-top: 20px;
		}
	}
}
</style>
