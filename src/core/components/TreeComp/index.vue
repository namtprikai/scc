<template>
	<div class="treeWrap" ref="treeWrap">
		<svg width="width" height="height" id="treesvg"></svg>
	</div>
</template>

<script lang="ts">
import * as d3 from 'd3';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { RouteRecord } from 'vue-router';
import pathToRegexp from 'path-to-regexp';
import { eventHub } from '@/init/eventHub';
import { TalkScript } from '@/store/modules/talkScript';
// @ts-ignore
@Component
export default class TreeComp extends Vue {
	@Prop()
	private data: any;

	private width = 200;
	private height = 200;
	setSize() {
		const treeWrap: any = this.$refs.treeWrap;
		this.width = treeWrap.clientWidth;
		this.height = treeWrap.clientHeight;
		console.log(this.width);
	}

	rendGrafh() {
		console.log(d3);
		const svg = d3.select('#treesvg');
		// console.log(this.$refs.treeWrap.clientWidth);
		this.setSize();
		const width: any = this.width;
		const height: any = this.width;
		// tslint:disable-next-line:radix
		const g = svg.append('g').attr('transform', 'translate(' + (width / 2 + 50) + ',' + (height / 2 + 90) + ')');
		// const tree = (data:any) => d3.tree()
		//     .size([360, 500])
		//     .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
		//   (d3.hierarchy(data))
		const tree = d3
			.tree()
			.size([360, width / 4])
			.separation((a: any, b: any) => {
				return (a.parent == b.parent ? 1 : 2) / a.depth;
			});

		// d3.json(this.data)
		// .then((data:any)=>{
		var root = tree(d3.hierarchy(this.data));
		console.log(root);
		console.log(root.descendants().slice(1));
		var link = g
			.selectAll('.link')
			.data(root.descendants().slice(1))
			.enter()
			.append('path')
			.attr('class', 'link')
			.attr('d', (d: any) => {
				return 'M' + project(d.x, d.y) + 'C' + project(d.x, (d.y + d.parent.y) / 2) + ' ' + project(d.parent.x, (d.y + d.parent.y) / 2) + ' ' + project(d.parent.x, d.parent.y);
			});

		var node = g
			.selectAll('.node')
			.data(root.descendants())
			.enter()
			.append('g')
			.attr('class', function(d: any) {
				return 'node' + (d.children ? ' node--internal' : ' node--leaf');
			})
			.attr('transform', function(d: any) {
				return 'translate(' + project(d.x, d.y) + ')';
			});

		node.append('circle').attr('r', 2.5);

		node
			.append('text')
			.attr('dy', '.31em')
			.attr('x', function(d: any) {
				return d.x < 180 === !d.children ? 6 : -6;
			})
			.style('text-anchor', function(d) {
				return d.x < 180 === !d.children ? 'start' : 'end';
			})
			.attr('transform', function(d) {
				return 'rotate(' + (d.x < 180 ? d.x - 90 : d.x + 90) + ')';
			})
			.text(function(d: any) {
				console.log(d);
				return d.data.text;
			});
		// });

		function project(x: any, y: any) {
			const angle = ((x - 90) / 180) * Math.PI;
			const radius = y;
			return [radius * Math.cos(angle), radius * Math.sin(angle)];
		}
	}

	mounted() {
		this.rendGrafh();
	}
}
</script>
<style lang="scss" scoped>
.treeWrap {
	width: 100%;
	height: 100%;
}
</style>

<style lang="scss">
.node circle {
	fill: #999;
}

.node text {
	font: 10px sans-serif;
}

.node--internal circle {
	fill: #555;
}

.node--internal text {
	text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
}

.link {
	fill: none;
	stroke: #555;
	stroke-opacity: 0.4;
	stroke-width: 1.5px;
}
</style>
