<template>
	<div class="ticket-analyze-graph" ref="TicketAnalyzeGraph">
		<div
			class="graph-wrapper"
			v-for="(g, i) in GraphData"
			:key="i"
			:style="{
				width: g.width ? g.width : defaultWidth,
				height: g.height ? g.height : defaultHeight,
			}"
		>
			<Bar v-if="g.graph === 'bar'" :data="g.data" :titleText="g.title" :valueUnit="g.unitText" width="100%" height="100%" />
			<Pareto v-else-if="g.graph === 'pareto'" :data="g.data" :titleText="g.title" :valueUnit="g.unitText" width="100%" height="100%" :xLabelAll="g.xLabelAll || 'false'" />
			<Pie v-else-if="g.graph === 'pie'" :data="g.data" :titleText="g.title" :valueUnit="g.unitText" width="100%" height="100%" />
		</div>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import TicketSearch from '../../components/TicketSearch/index.vue';
import { GraphData } from './index.i';
import { Bar, Pareto, Pie } from '@/components/Charts';

// @ts-ignore
@Component({
	name: 'TicketAnalyzeGraph',
	components: {
		TicketSearch,
		Bar,
		Pareto,
		Pie,
	},
})
export default class TicketAnalyzeGraph extends Vue {
	@Prop({
		type: Array,
		default: [],
	})
	private GraphData!: GraphData[];

	@Prop({ type: String, default: '100%' })
	private defaultWidth!: string;

	@Prop({ type: String, default: '400px' })
	private defaultHeight!: string;
}
</script>
<style lang="scss" scoped>
.ticket-analyze-graph {
	width: 100%;
	height: auto;
	display: flex;
	flex-flow: row wrap;
}
</style>
