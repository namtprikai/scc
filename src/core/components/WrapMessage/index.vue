<template>
	<div>
		<div class="blockWrap">
			<div class="relCon">
				<div class="blockWrap__inner">
					<p>{{ Message }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
// @ts-ignore
@Component
export default class WrapMessage extends Vue {
	public created() {}
	public destroyed() {}
	get Message() {
		return this.$attrs.message;
	}
}
</script>

<style lang="scss" type="scss" scoped>
.relCon {
	position: relative;
	width: 100%;
	height: 100%;
}
.block-center {
	margin: auto;
}
.blockWrap {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	margin: auto;
	width: 100%;
	height: 100%;
	z-index: 9;
	background-color: rgba(255, 255, 255, 0.7);

	&__inner {
		position: absolute;
		top: 100px;
		left: 0px;
		right: 0px;
		// bottom: 0px;
		margin: auto;
		text-align: center;
		// width:100px;
		// height:30px;
		width: 100%;
		height: 1em;
		font-weight: bold;
	}
}
</style>
