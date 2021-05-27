<template>
	<div class="aggregate-results-table-main">
		<b-form-select v-model="aggValue" :options="showAggOpt"></b-form-select>
		<vue-good-table
			:rows="rows"
			:columns="colums"
			:sort-options="{
				enabled: true,
				initialSortBy: [
					{ field: 'view_count', type: 'desc' },
					{ field: 'resolved_per', type: 'desc' },
				],
			}"
			:pagination-options="{
				enabled: true,
				perPage: 15,
				perPageDropdown: [10, 15, 30, 50],
				rowsPerPageLabel: '表示件数',
				mode: 'pages',
			}"
		>
			<template slot="table-row" slot-scope="props">
				<div v-if="['view_count', 'resolved_count', 'unresolved_count'].indexOf(props.column.field) > -1">
					<span>
						{{ props.row[props.column.field][0] }}
					</span>
					<span
						v-if="props.row[props.column.field][1] !== 0"
						:class="{
							'vgt-row_count__plus': props.row[props.column.field][1] > 0,
							'vgt-row_count__minus': props.row[props.column.field][1] < 0,
						}"
					>
						{{ props.row[props.column.field][1] > 0 ? `(+${props.row[props.column.field][1]})` : `(${props.row[props.column.field][1]})` }}
					</span>
				</div>
				<span v-else>{{ props.formattedRow[props.column.field] }}</span>
			</template>
		</vue-good-table>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import { TalkScript as ITalkScript } from '@/store/modules/talkScript';
import { IVueGoodTableColumn } from './index.i';

// @ts-ignore
@Component({ name: 'AggregateResultsTableMain' })
export default class AggregateResultsTableMain extends Vue {
	@Prop({ type: Array, default: [] })
	ts!: ITalkScript[];

	@Prop({ type: Array, default: [] })
	tickets!: any[];

	@Prop({ type: Array, default: [] })
	ctickets!: any[];

	@Prop({ type: String, default: '-' })
	defaultNoneText!: string;

	private showAggOpt: { text: string; value: string }[] = [
		{ text: '親カテゴリ', value: 'log_faq_parent_category' },
		{ text: '子カテゴリ', value: 'log_faq_child_category' },
		{ text: 'FAQ', value: 'log_faq_title' },
	];

	private aggValue = 'log_faq_title';

	private get aggTitles(): string[] {
		if (this.ts.length <= 0) return [];
		return _(this.ts)
			.chain()
			.filter(t => {
				switch (this.aggValue) {
					case 'log_faq_parent_category':
						return t.type === 'node' && t.parent === '#';
					case 'log_faq_child_category':
						return t.type === 'node' && t.parent !== '#';
					case 'log_faq_title':
						return t.type === 'leaf';
				}
				return false;
			})
			.groupBy((t: ITalkScript) => t.text)
			.keys()
			.value();
	}

	public created() {
		this.updateRows();
	}

	private rowsGroup: { [key: string]: any[] } = {};

	@Watch('tickets')
	@Watch('c_tickets')
	@Watch('ts')
	private updateRows() {
		if (this.tickets.length > 0) {
			const aggValue = this.aggValue;
			for (let i = 0; i < this.showAggOpt.length; i++) {
				const opt = this.showAggOpt[i];
				this.aggValue = opt.value;
				const rows = this.getAggRows(opt.value);
				this.rowsGroup[opt.value] = rows;
			}
			this.$emit('update', this.rowsGroup);
			this.aggValue = aggValue;
			this.updateAggSelection();
		}
	}

	@Watch('aggValue')
	@Watch('rowsGroup')
	private updateAggSelection(): void {
		this.rows = this.rowsGroup[this.aggValue] ?? [];
	}

	private getAggRows(aggValue: string) {
		let rows: any[] = [];
		rows = this.AggResults(
			this.aggTitles,
			this.tickets,
			this.ctickets,
			(t: any) => {
				return t[aggValue];
			},
			(t: any) =>
				_(t[aggValue])
					.keyBy(k => k)
					.keys()
					.join(',') ?? '',
		);
		return rows;
	}

	private rows: any[] = [];
	private colums: IVueGoodTableColumn[] = [
		{
			label: 'タイトル',
			field: 'title',
			sortable: false,
			width: '30%',
		},
		{
			label: '閲覧件数',
			field: 'view_count',
			sortFn: (a: number[], b: number[]) => (a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1),
			thClass: 'vgt-th_view-count',
			tdClass: 'vgt-td_view-count',
		},
		{
			label: '全体に占める割合',
			field: 'view_count_per',
			formatFn: (v: number): string => `${Math.floor(v * 10000) / 100}%`,
			sortFn: (a: number, b: number) => {
				return a === b ? 0 : a > b ? 1 : -1;
			},
			thClass: 'vgt-th_view-count',
			tdClass: 'vgt-td_view-count',
		},
		{
			label: '増減率',
			field: 'view_count_id',
			formatFn: (v: number): string => {
				if (typeof v !== 'number' || v == Infinity || v == null || !/\d/.test(String(v))) {
					return this.defaultNoneText;
				}
				return `${Math.floor(v * 10000) / 100}%`;
			},
			sortFn: (a: number, b: number) => {
				if (a === Infinity) return -1;
				if (b === Infinity) return 1;
				return a === b ? 0 : a > b ? 1 : -1;
			},
			thClass: 'vgt-th_view-count',
			tdClass: 'vgt-td_view-count',
		},
		{
			label: '解決数',
			field: 'resolved_count',
			sortFn: (a: number[], b: number[]) => (a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1),
			thClass: 'vgt-th_resolved',
			tdClass: 'vgt-td_resolved',
		},
		{
			label: '解決率',
			field: 'resolved_per',
			formatFn: (v: number): string => {
				return v ? `${Math.floor(v * 10000) / 100}%` : '0%';
			},
			sortFn: (a: number, b: number) => {
				return a === b ? 0 : a > b ? 1 : -1;
			},
			thClass: 'vgt-th_resolved',
			tdClass: 'vgt-td_resolved',
		},
		{
			label: '増減率',
			field: 'resolved_id',
			formatFn: (v: number): string => {
				return v !== Infinity ? `${Math.floor(v * 10000) / 100}%` : this.defaultNoneText;
			},
			sortFn: (a: number, b: number) => {
				if (a === Infinity) return -1;
				if (b === Infinity) return 1;
				return a === b ? 0 : a > b ? 1 : -1;
			},
			thClass: 'vgt-th_resolved',
			tdClass: 'vgt-td_resolved',
		},
		{
			label: '未解決数',
			field: 'unresolved_count',
			sortFn: (a: number[], b: number[]) => (a[0] === b[0] ? 0 : a[0] > b[0] ? 1 : -1),
			thClass: 'vgt-th_unresolved',
			tdClass: 'vgt-td_unresolved',
		},
		{
			label: '未解決率',
			field: 'unresolved_per',
			formatFn: (v: number): string => (v ? `${Math.floor(v * 10000) / 100}%` : '0%'),
			sortFn: (a: number, b: number) => {
				return a === b ? 0 : a > b ? 1 : -1;
			},
			thClass: 'vgt-th_unresolved',
			tdClass: 'vgt-td_unresolved',
		},
		{
			label: '増減率',
			field: 'unresolved_id',
			formatFn: (v: number): string => {
				return v !== Infinity ? `${Math.floor(v * 10000) / 100}%` : this.defaultNoneText;
			},
			sortFn: (a: number, b: number) => {
				if (a === Infinity) return -1;
				if (b === Infinity) return 1;
				return a === b ? 0 : a > b ? 1 : -1;
			},
			thClass: 'vgt-th_unresolved',
			tdClass: 'vgt-td_unresolved',
		},
	];

	private AggResults(keys: string[], seed: any[], cseed: any[], filterCb: Function, groupCb: Function) {
		const filterdItems = _.chain(seed)
			.filter(v => filterCb(v))
			.value();
		const filterdCItems = _.chain(cseed)
			.filter(v => filterCb(v))
			.value();
		const group = _(filterdItems)
			.chain()
			.groupBy(v => groupCb(v));
		const cgroup = _(filterdCItems)
			.chain()
			.groupBy(v => groupCb(v));
		const TOTAL_VIEW = filterdItems.length;
		keys = _(keys.concat(group.keys().value(), cgroup.keys().value()))
			.uniq()
			.value();
		const C_TOTAL_VIEW = filterdCItems.length;

		return _(keys)
			.map(key => {
				const g: any = _(group)
					.chain()
					.get(key);
				const cg: any = _(cgroup)
					.chain()
					.get(key);
				const VIEW_COUNT = g.size().value();
				const C_VIEW_COUNT = cg.size().value();
				const feedback_group = g.groupBy((v: any) => v.feedback);
				const c_feedback_group = cg.groupBy((v: any) => v.feedback);
				const RESOLVED_COUNT = feedback_group
					.get('resolved')
					.size()
					.value();
				const C_RESOLVED_COUNT = c_feedback_group
					.get('resolved')
					.size()
					.value();
				const UNRESOLVED_COUNT = feedback_group
					.get('unresolved')
					.size()
					.value();
				const C_UNRESOLVED_COUNT = c_feedback_group
					.get('unresolved')
					.size()
					.value();
				return {
					title: key,
					view_count: [VIEW_COUNT, VIEW_COUNT - C_VIEW_COUNT],
					view_count_per: VIEW_COUNT / TOTAL_VIEW || 0,
					view_count_id: VIEW_COUNT / C_VIEW_COUNT - 1 || 0,
					resolved_count: [RESOLVED_COUNT, RESOLVED_COUNT - C_RESOLVED_COUNT],
					resolved_per: RESOLVED_COUNT / (RESOLVED_COUNT + UNRESOLVED_COUNT) || 0,
					resolved_id: RESOLVED_COUNT / C_RESOLVED_COUNT - 1 || 0,
					unresolved_count: [UNRESOLVED_COUNT, UNRESOLVED_COUNT - C_UNRESOLVED_COUNT],
					unresolved_per: UNRESOLVED_COUNT / (RESOLVED_COUNT + UNRESOLVED_COUNT) || 0,
					unresolved_id: UNRESOLVED_COUNT / C_UNRESOLVED_COUNT - 1 || 0,
				};
			})
			.value();
	}
}
</script>
<style lang="scss">
.aggregate-results-table-main {
	.vgt-th {
		&_view-count {
			background: #fbe6e6;
		}
		&_resolved {
			background: #e4f7f9;
		}
		&_unresolved {
			background: #f4f9df;
		}
	}
	.vgt-td {
		&_view-count {
			background: #fffafa;
		}
		&_resolved {
			background: #fdffff;
		}
		&_unresolved {
			background: #fefffa;
		}
	}
}
</style>
<style lang="scss" scoped>
.aggregate-results-table-main {
	.vgt-row {
		&_count {
			@mixin count {
				font-family: monospace;
				font-size: 80%;
			}
			&__plus {
				color: red;
				@include count();
			}
			&__minus {
				color: blue;
				@include count();
			}
		}
	}
}
</style>
