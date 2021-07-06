<template>
	<div class="b-card-accordion">
		<b-card no-body>
			<b-card-header>
				<div @click="isShow = !isShow" class="b-card-accordion-header">
					<slot name="header">{{ title }}</slot>
					<b-icon
						class="b-card-accordion-header__icon"
						icon="chevron-down"
						:rotate="rotate"
					></b-icon>
				</div>
				<!-- </a> -->
			</b-card-header>
			<b-collapse v-model="isShow">
				<b-card-body>
					<slot name="body" v-bind:isShow="isShow" />
				</b-card-body>
			</b-collapse>
		</b-card>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
import { Type } from "@/components/Charts";
@Component({ name: "BCardAccordion" })
export default class BCardAccordion extends Vue {
	private isShow = true;
	private get rotate(): number {
		return this.isShow ? 0 : 90;
	}

	@Prop({ type: String, default: "" })
	title!: string;

	@Prop({ type: Boolean, default: true })
	visible!: boolean;

	created() {
		this.isShow = this.visible;
	}
}
</script>
<style lang="scss" type="scss" scoped>
.b-card-accordion-header {
	position: relative;
	cursor: pointer;
	&__icon {
		position: absolute;
		margin: auto;
		right: 0px;
		top: 0px;
		bottom: 0px;
	}
}
</style>
