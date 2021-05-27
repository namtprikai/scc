<template>
	<div class="b_4" v-bind:style="style">
		<vertical @height="Height">
			<div slot="left">
				<router-view name="v1" data-name="v1" :height="height" />
			</div>

			<div slot="right">
				<router-view name="v2" data-name="v2" :height="height" />
			</div>
		</vertical>
	</div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import FitStyle from '@/frames/mixin/fitStyle.vue';
import Horizontal from '@/components/Divider/Horizontal.vue';
import Vertical from '@/components/Divider/Vertical.vue';
import { eventHub } from '@/init/eventHub';

// @ts-ignore
@Component({
	components: {
		Vertical,
		Horizontal,
	},
})
export default class Divider extends mixins(FitStyle) {
	style: Object = {};
	height: any = 'auto';
	Height(size: any) {
		this.height = size - 110;
	}

	mounted() {
		this.style = this.fitStyle();
		eventHub.$on('fitStyle', () => {
			this.style = this.fitStyle();
		});
		window.addEventListener('resize', () => {
			this.style = this.fitStyle();
		});
	}
}
</script>

<style type="scss" scoped>
.b_4 {
	position: fixed;
	height: 100%;
	width: 100%;
	right: 0;
}
</style>
