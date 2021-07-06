<template>
	<div class="data-size-info">
		<b-container>
			<div
				class="data-size-info_discription mb-3"
				v-html="$sanitize(discription)"
			></div>
			<b-row>
				<b-col cols="2">FAQ数</b-col>
				<b-col cols="10" class="mb-3">
					<div class="data-size-info_progress">
						<b-progress :value="count" :max="max" show-value animated></b-progress>
						<div class="data-size-info_progress__countnums">
							<div
								class="data-size-info_progress__countnum"
								v-for="n in countNums"
								:key="n"
							>
								{{ n }}
							</div>
						</div>
					</div>
				</b-col>
				<b-col offset="2" cols="10"
					>上限{{ max }}件に対して、{{ count }}件利用中({{ count_per }}%)</b-col
				>
			</b-row>
		</b-container>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MaxFaqFile } from "../../config";
// @ts-ignore
@Component({ name: "DataSizeInfo" })
export default class DataSizeInfo extends Vue {
	@Prop({ type: String, default: "" })
	private discription!: string;

	private max: number = MaxFaqFile;
	private count = 0;
	private n = 5;
	private get count_per(): number {
		return Math.floor((this.count / this.max) * 10000) / 100;
	}

	private get countNums(): number[] {
		return [...Array(this.n).keys()]
			.reduce(
				(r: any, i: number) => {
					r.push(Math.floor((this.max / this.n) * i));
					return r;
				},
				[this.max]
			)
			.sort();
	}

	public created() {}
}
</script>
<style lang="scss" scoped>
.data-size-info {
	&_progress {
		&__countnums {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
		}
	}
}
</style>
