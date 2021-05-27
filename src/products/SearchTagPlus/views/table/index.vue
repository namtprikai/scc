<template>
	<div class="app-container">
		<tree-comp :data="Data" style="width: 1500px; height: 1500px" v-if="!listLoading" />
		<!-- <el-table
			v-loading="listLoading"
			:data="list"
			element-loading-text="Loading"
			border
			fit
			highlight-current-row
		>
			<el-table-column align="center" label="ID" width="95">
				<template slot-scope="scope">{{ scope.$index }}</template>
			</el-table-column>
			<el-table-column label="Title">
				<template slot-scope="scope">{{ scope.row.title }}</template>
			</el-table-column>
			<el-table-column label="Author" width="110" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.author }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Pageviews" width="110" align="center">
				<template slot-scope="scope">{{ scope.row.pageviews }}</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="Status" width="110" align="center">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="Display_time" width="200">
				<template slot-scope="scope">
					<i class="el-icon-time"/>
					<span>{{ scope.row.display_time }}</span>
				</template>
			</el-table-column>
		</el-table> -->
	</div>
</template>

<script lang="ts">
import { getList } from '@/api/table';
import { Component, Vue } from 'vue-property-decorator';
import TreeComp from '@/components/TreeComp/index.vue';
import { TalkScriptModule } from '@/store/modules/talkScript';
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
	},
	components: {
		TreeComp,
	},
})
export default class Table extends Vue {
	private list = null;
	private listLoading = true;
	private listQuery = {};
	private data = {
		title: 'flare',
		children: [
			{
				title: 'analytics',
				children: [
					{
						title: 'cluster',
						children: [
							{ title: 'AgglomerativeCluster', size: 3938 },
							{ title: 'CommunityStructure', size: 3812 },
							{ title: 'HierarchicalCluster', size: 6714 },
							{ title: 'MergeEdge', size: 743 },
						],
					},
					{
						title: 'graph',
						children: [
							{ title: 'BetweennessCentrality', size: 3534 },
							{ title: 'LinkDistance', size: 5731 },
							{ title: 'MaxFlowMinCut', size: 7840 },
							{ title: 'ShortestPaths', size: 5914 },
							{ title: 'SpanningTree', size: 3416 },
						],
					},
					{
						title: 'optimization',
						children: [{ title: 'AspectRatioBanker', size: 7074 }],
					},
				],
			},
			{
				title: 'animate',
				children: [
					{ title: 'Easing', size: 17010 },
					{ title: 'FunctionSequence', size: 5842 },
					{
						title: 'interpolate',
						children: [
							{ title: 'ArrayInterpolator', size: 1983 },
							{ title: 'ColorInterpolator', size: 2047 },
							{ title: 'DateInterpolator', size: 1375 },
							{ title: 'Interpolator', size: 8746 },
							{ title: 'MatrixInterpolator', size: 2202 },
							{ title: 'NumberInterpolator', size: 1382 },
							{ title: 'ObjectInterpolator', size: 1629 },
							{ title: 'PointInterpolator', size: 1675 },
							{ title: 'RectangleInterpolator', size: 2042 },
						],
					},
					{ title: 'ISchedulable', size: 1041 },
					{ title: 'Parallel', size: 5176 },
					{ title: 'Pause', size: 449 },
					{ title: 'Scheduler', size: 5593 },
					{ title: 'Sequence', size: 5534 },
					{ title: 'Transition', size: 9201 },
					{ title: 'Transitioner', size: 19975 },
					{ title: 'TransitionEvent', size: 1116 },
					{ title: 'Tween', size: 6006 },
				],
			},
			{
				title: 'data',
				children: [
					{
						title: 'converters',
						children: [
							{ title: 'Converters', size: 721 },
							{ title: 'DelimitedTextConverter', size: 4294 },
							{ title: 'GraphMLConverter', size: 9800 },
							{ title: 'IDataConverter', size: 1314 },
							{ title: 'JSONConverter', size: 2220 },
						],
					},
					{ title: 'DataField', size: 1759 },
					{ title: 'DataSchema', size: 2165 },
					{ title: 'DataSet', size: 586 },
					{ title: 'DataSource', size: 3331 },
					{ title: 'DataTable', size: 772 },
					{ title: 'DataUtil', size: 3322 },
				],
			},
			{
				title: 'display',
				children: [
					{ title: 'DirtySprite', size: 8833 },
					{ title: 'LineSprite', size: 1732 },
					{ title: 'RectSprite', size: 3623 },
					{ title: 'TextSprite', size: 10066 },
				],
			},
			{
				title: 'flex',
				children: [{ title: 'FlareVis', size: 4116 }],
			},
			{
				title: 'physics',
				children: [
					{ title: 'DragForce', size: 1082 },
					{ title: 'GravityForce', size: 1336 },
					{ title: 'IForce', size: 319 },
					{ title: 'NBodyForce', size: 10498 },
					{ title: 'Particle', size: 2822 },
					{ title: 'Simulation', size: 9983 },
					{ title: 'Spring', size: 2213 },
					{ title: 'SpringForce', size: 1681 },
				],
			},
			{
				title: 'query',
				children: [
					{ title: 'AggregateExpression', size: 1616 },
					{ title: 'And', size: 1027 },
					{ title: 'Arithmetic', size: 3891 },
					{ title: 'Average', size: 891 },
					{ title: 'BinaryExpression', size: 2893 },
					{ title: 'Comparison', size: 5103 },
					{ title: 'CompositeExpression', size: 3677 },
					{ title: 'Count', size: 781 },
					{ title: 'DateUtil', size: 4141 },
					{ title: 'Distinct', size: 933 },
					{ title: 'Expression', size: 5130 },
					{ title: 'ExpressionIterator', size: 3617 },
					{ title: 'Fn', size: 3240 },
					{ title: 'If', size: 2732 },
					{ title: 'IsA', size: 2039 },
					{ title: 'Literal', size: 1214 },
					{ title: 'Match', size: 3748 },
					{ title: 'Maximum', size: 843 },
					{
						title: 'methods',
						children: [
							{ title: 'add', size: 593 },
							{ title: 'and', size: 330 },
							{ title: 'average', size: 287 },
							{ title: 'count', size: 277 },
							{ title: 'distinct', size: 292 },
							{ title: 'div', size: 595 },
							{ title: 'eq', size: 594 },
							{ title: 'fn', size: 460 },
							{ title: 'gt', size: 603 },
							{ title: 'gte', size: 625 },
							{ title: 'iff', size: 748 },
							{ title: 'isa', size: 461 },
							{ title: 'lt', size: 597 },
							{ title: 'lte', size: 619 },
							{ title: 'max', size: 283 },
							{ title: 'min', size: 283 },
							{ title: 'mod', size: 591 },
							{ title: 'mul', size: 603 },
							{ title: 'neq', size: 599 },
							{ title: 'not', size: 386 },
							{ title: 'or', size: 323 },
							{ title: 'orderby', size: 307 },
							{ title: 'range', size: 772 },
							{ title: 'select', size: 296 },
							{ title: 'stddev', size: 363 },
							{ title: 'sub', size: 600 },
							{ title: 'sum', size: 280 },
							{ title: 'update', size: 307 },
							{ title: 'variance', size: 335 },
							{ title: 'where', size: 299 },
							{ title: 'xor', size: 354 },
							{ title: '_', size: 264 },
						],
					},
					{ title: 'Minimum', size: 843 },
					{ title: 'Not', size: 1554 },
					{ title: 'Or', size: 970 },
					{ title: 'Query', size: 13896 },
					{ title: 'Range', size: 1594 },
					{ title: 'StringUtil', size: 4130 },
					{ title: 'Sum', size: 791 },
					{ title: 'Variable', size: 1124 },
					{ title: 'Variance', size: 1876 },
					{ title: 'Xor', size: 1101 },
				],
			},
			{
				title: 'scale',
				children: [
					{ title: 'IScaleMap', size: 2105 },
					{ title: 'LinearScale', size: 1316 },
					{ title: 'LogScale', size: 3151 },
					{ title: 'OrdinalScale', size: 3770 },
					{ title: 'QuantileScale', size: 2435 },
					{ title: 'QuantitativeScale', size: 4839 },
					{ title: 'RootScale', size: 1756 },
					{ title: 'Scale', size: 4268 },
					{ title: 'ScaleType', size: 1821 },
					{ title: 'TimeScale', size: 5833 },
				],
			},
			{
				title: 'util',
				children: [
					{ title: 'Arrays', size: 8258 },
					{ title: 'Colors', size: 10001 },
					{ title: 'Dates', size: 8217 },
					{ title: 'Displays', size: 12555 },
					{ title: 'Filter', size: 2324 },
					{ title: 'Geometry', size: 10993 },
					{
						title: 'heap',
						children: [
							{ title: 'FibonacciHeap', size: 9354 },
							{ title: 'HeapNode', size: 1233 },
						],
					},
					{ title: 'IEvaluable', size: 335 },
					{ title: 'IPredicate', size: 383 },
					{ title: 'IValueProxy', size: 874 },
					{
						title: 'math',
						children: [
							{ title: 'DenseMatrix', size: 3165 },
							{ title: 'IMatrix', size: 2815 },
							{ title: 'SparseMatrix', size: 3366 },
						],
					},
					{ title: 'Maths', size: 17705 },
					{ title: 'Orientation', size: 1486 },
					{
						title: 'palette',
						children: [
							{ title: 'ColorPalette', size: 6367 },
							{ title: 'Palette', size: 1229 },
							{ title: 'ShapePalette', size: 2059 },
							{ title: 'SizePalette', size: 2291 },
						],
					},
					{ title: 'Property', size: 5559 },
					{ title: 'Shapes', size: 19118 },
					{ title: 'Sort', size: 6887 },
					{ title: 'Stats', size: 6557 },
					{ title: 'Strings', size: 22026 },
				],
			},
			{
				title: 'vis',
				children: [
					{
						title: 'axis',
						children: [
							{ title: 'Axes', size: 1302 },
							{ title: 'Axis', size: 24593 },
							{ title: 'AxisGridLine', size: 652 },
							{ title: 'AxisLabel', size: 636 },
							{ title: 'CartesianAxes', size: 6703 },
						],
					},
					{
						title: 'controls',
						children: [
							{ title: 'AnchorControl', size: 2138 },
							{ title: 'ClickControl', size: 3824 },
							{ title: 'Control', size: 1353 },
							{ title: 'ControlList', size: 4665 },
							{ title: 'DragControl', size: 2649 },
							{ title: 'ExpandControl', size: 2832 },
							{ title: 'HoverControl', size: 4896 },
							{ title: 'IControl', size: 763 },
							{ title: 'PanZoomControl', size: 5222 },
							{ title: 'SelectionControl', size: 7862 },
							{ title: 'TooltipControl', size: 8435 },
						],
					},
					{
						title: 'data',
						children: [
							{ title: 'Data', size: 20544 },
							{ title: 'DataList', size: 19788 },
							{ title: 'DataSprite', size: 10349 },
							{ title: 'EdgeSprite', size: 3301 },
							{ title: 'NodeSprite', size: 19382 },
							{
								title: 'render',
								children: [
									{ title: 'ArrowType', size: 698 },
									{ title: 'EdgeRenderer', size: 5569 },
									{ title: 'IRenderer', size: 353 },
									{ title: 'ShapeRenderer', size: 2247 },
								],
							},
							{ title: 'ScaleBinding', size: 11275 },
							{ title: 'Tree', size: 7147 },
							{ title: 'TreeBuilder', size: 9930 },
						],
					},
					{
						title: 'events',
						children: [
							{ title: 'DataEvent', size: 2313 },
							{ title: 'SelectionEvent', size: 1880 },
							{ title: 'TooltipEvent', size: 1701 },
							{ title: 'VisualizationEvent', size: 1117 },
						],
					},
					{
						title: 'legend',
						children: [
							{ title: 'Legend', size: 20859 },
							{ title: 'LegendItem', size: 4614 },
							{ title: 'LegendRange', size: 10530 },
						],
					},
					{
						title: 'operator',
						children: [
							{
								title: 'distortion',
								children: [
									{ title: 'BifocalDistortion', size: 4461 },
									{ title: 'Distortion', size: 6314 },
									{ title: 'FisheyeDistortion', size: 3444 },
								],
							},
							{
								title: 'encoder',
								children: [
									{ title: 'ColorEncoder', size: 3179 },
									{ title: 'Encoder', size: 4060 },
									{ title: 'PropertyEncoder', size: 4138 },
									{ title: 'ShapeEncoder', size: 1690 },
									{ title: 'SizeEncoder', size: 1830 },
								],
							},
							{
								title: 'filter',
								children: [
									{ title: 'FisheyeTreeFilter', size: 5219 },
									{ title: 'GraphDistanceFilter', size: 3165 },
									{ title: 'VisibilityFilter', size: 3509 },
								],
							},
							{ title: 'IOperator', size: 1286 },
							{
								title: 'label',
								children: [
									{ title: 'Labeler', size: 9956 },
									{ title: 'RadialLabeler', size: 3899 },
									{ title: 'StackedAreaLabeler', size: 3202 },
								],
							},
							{
								title: 'layout',
								children: [
									{ title: 'AxisLayout', size: 6725 },
									{ title: 'BundledEdgeRouter', size: 3727 },
									{ title: 'CircleLayout', size: 9317 },
									{ title: 'CirclePackingLayout', size: 12003 },
									{ title: 'DendrogramLayout', size: 4853 },
									{ title: 'ForceDirectedLayout', size: 8411 },
									{ title: 'IcicleTreeLayout', size: 4864 },
									{ title: 'IndentedTreeLayout', size: 3174 },
									{ title: 'Layout', size: 7881 },
									{ title: 'NodeLinkTreeLayout', size: 12870 },
									{ title: 'PieLayout', size: 2728 },
									{ title: 'RadialTreeLayout', size: 12348 },
									{ title: 'RandomLayout', size: 870 },
									{ title: 'StackedAreaLayout', size: 9121 },
									{ title: 'TreeMapLayout', size: 9191 },
								],
							},
							{ title: 'Operator', size: 2490 },
							{ title: 'OperatorList', size: 5248 },
							{ title: 'OperatorSequence', size: 4190 },
							{ title: 'OperatorSwitch', size: 2581 },
							{ title: 'SortOperator', size: 2023 },
						],
					},
					{ title: 'Visualization', size: 16540 },
				],
			},
		],
	};

	public get Data() {
		console.log(TalkScriptModule.TalkScriptTree2);
		return {
			title: 'flare',
			children: TalkScriptModule.TalkScriptTree2,
		};
	}

	private created() {
		this.fetchData();
	}

	private async fetchData() {
		this.listLoading = true;
		await TalkScriptModule.getTalkScript();
		getList(this.listQuery).then((response: any) => {
			this.list = response.data.items;
			this.listLoading = false;
		});
	}
}
</script>
