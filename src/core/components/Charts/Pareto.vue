<template>
	<div :class="className" :id="id" :style="style" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import echarts from 'echarts';
import { eventHub } from '@/init/eventHub';
import { IDatum } from './index.i';

// @ts-ignore
@Component
export default class Pareto extends Vue {
	@Prop({ default: '500px' }) readonly height!: string;
	@Prop({ default: '500px' }) readonly width!: string;
	@Prop({ default: 'pareto_chart' }) readonly id!: string;
	@Prop({ default: 'pareto-chart' }) readonly className!: string;
	@Prop({ default: 'titleText' }) readonly titleText!: string;
	@Prop({ default: 'value' }) readonly valueUnit!: string;
	@Prop({ default: false }) readonly xLabelAll!: boolean;
	@Prop({
		default: () => [
			{ value: 200, name: 'hoge' },
			{ value: 100, name: 'fuga' },
			{ value: 300, name: 'piyo' },
		],
	})
	readonly data!: IDatum[];

	style: Object = { height: this.height, width: this.width };

	get chart(): echarts.ECharts {
		return echarts.init(this.$el as HTMLDivElement);
	}

	private mounted() {
		this.initChart();
		eventHub.$on('tabclick', this.initChart);
	}

	private destroyed() {
		eventHub.$off('tabclick', this.initChart);
	}

	private beforeDestroy() {
		this.chart.dispose();
	}

	@Watch('data')
	private initChart() {
		console.log('initChart');

		const title: echarts.EChartTitleOption = {
			text: this.titleText,
			left: '20',
			top: '20',
			textStyle: {
				color: '#fff',
				fontSize: 22,
			},
			subtextStyle: {
				color: '#90979c',
				fontSize: 16,
			},
		};

		const tooltip: echarts.EChartOption.Tooltip = {
			trigger: 'axis',
			formatter: `{b}: {c}${this.valueUnit}`,
		};

		const grid = {
			left: '10%',
			right: '10%',
			borderWidth: 0,
			top: 100,
			bottom: 100,
			textStyle: {
				color: '#fff',
			},
		};

		const xAxis: echarts.EChartOption.XAxis = {
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#90979c',
				},
			},
			splitLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				showMinLabel: true,
				showMaxLabel: true,
			},
			splitArea: {
				show: false,
			},
			data: this.data.map(({ name }) => name),
		};
		if (this.xLabelAll) {
			if (xAxis.axisLabel) {
				xAxis.axisLabel.interval = 0;
				xAxis.axisLabel.rotate = 90;
				xAxis.axisLabel.fontSize = 10;
				xAxis.axisLabel.formatter = (v: any) => (v.length > 8 ? v.slice(0, 8) + '...' : v);
			}
			if (grid) {
				grid.bottom = 150;
			}
		}

		const max = Math.max(...this.data.map(({ value }) => value));
		const yAxis: echarts.EChartOption.YAxis[] = [
			{
				type: 'value',
				splitLine: {
					show: false,
				},
				axisLine: {
					lineStyle: {
						color: '#90979c',
					},
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					interval: 0,
					showMaxLabel: true,
					showMinLabel: true,
				},
				splitArea: {
					show: false,
				},
				max,
				min: 0,
			},
			{
				type: 'value',
				name: '%',
				axisLine: {
					lineStyle: {
						color: '#90979c',
					},
				},
				axisLabel: {
					interval: 10,
					showMaxLabel: true,
					showMinLabel: true,
				},
				splitArea: {
					show: false,
				},
				max: 100,
				min: 0,
			},
		];

		const dataZoom = [
			{
				show: true,
				xAxisIndex: [0],
				height: '20',
				bottom: '20',
				handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
				handleSize: '110%',
				handleStyle: {
					color: '#d3dee5',
				},
				textStyle: {
					color: '#fff',
				},
				borderColor: '#90979c',
			},
			{
				type: 'inside',
				show: true,
			},
		];

		const sum = this.data.reduce((s, d) => s + d.value, 0);
		let accum = 0;
		const series: echarts.EChartOption.Series[] = [
			{
				type: 'bar',
				itemStyle: {
					normal: {
						color: 'rgba(0,191,183,1)',
						barBorderRadius: 0,
						label: {
							show: true,
							position: 'top',
							formatter: (p: IDatum) => (p.value > 0 ? p.value : ''),
						},
					},
				},
				data: this.data.map(({ value }) => value),
			},
			{
				type: 'line',
				symbol: 'none',
				data: this.data.map(({ value }) => {
					accum += value;
					return (max * accum) / sum;
				}),
			},
		];

		this.chart.setOption({
			backgroundColor: '#1f2d3d',
			title,
			tooltip,
			grid,
			xAxis,
			yAxis,
			dataZoom,
			series,
		});
	}
}
</script>
