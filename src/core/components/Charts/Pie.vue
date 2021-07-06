<template>
	<div :class="className" :id="id" :style="style" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import echarts from "echarts";
import { eventHub } from "@/init/eventHub";
import { IDatum } from "./index.i";

// @ts-ignore
@Component
export default class Pie extends Vue {
	@Prop({ default: "500px" }) readonly height!: string;
	@Prop({ default: "500px" }) readonly width!: string;
	@Prop({ default: "pie_chart" }) readonly id!: string;
	@Prop({ default: "pie-chart" }) readonly className!: string;
	@Prop({ default: "titleText" }) readonly titleText!: string;
	@Prop({ default: "" }) readonly valueUnit!: string;
	@Prop({
		default: () => [
			{ value: 200, name: "hoge" },
			{ value: 100, name: "fuga" },
			{ value: 300, name: "piyo" },
		],
	})
	readonly data!: IDatum[];

	style: Object = { height: this.height, width: this.width };

	get chart(): echarts.ECharts {
		return echarts.init(this.$el as HTMLDivElement);
	}

	private mounted() {
		this.initChart();
		eventHub.$on("tabclick", this.initChart);
	}

	private destroyed() {
		eventHub.$off("tabclick", this.initChart);
	}

	private beforeDestroy() {
		this.chart.dispose();
	}

	@Watch("data")
	private initChart() {
		console.log("initChart");

		const title: echarts.EChartTitleOption = {
			text: this.titleText,
			left: "20",
			top: "20",
			textStyle: {
				color: "#fff",
				fontSize: 22,
			},
			subtextStyle: {
				color: "#90979c",
				fontSize: 16,
			},
		};

		const tooltip: echarts.EChartOption.Tooltip = {
			trigger: "item",
			formatter: `{b}<br>{c}${this.valueUnit}<br>{d}%`,
		};

		const legend: Object = {
			type: "scroll",
			orient: "vertical",
			right: "10",
			top: "20",
			bottom: "20",
			textStyle: {
				color: "#90979c",
			},
			data: this.data.map(({ name }) => name),
		};

		const series: echarts.EChartOption.Series[] = [
			{
				type: "pie",
				radius: "65%",
				center: ["50%", "50%"],
				label: {
					formatter: "{d}%",
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
				data: this.data,
			},
		];

		this.chart.setOption({
			backgroundColor: "#1f2d3d",
			title,
			tooltip,
			legend,
			series,
		});
	}
}
</script>
