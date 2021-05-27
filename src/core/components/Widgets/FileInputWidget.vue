<template>
	<div class="file-input-widget">
		<b-form-file v-model="file" :state="isState" :placeholder="placeholder" :drop-placeholder="dropPlaceholder" @input="fileChanged" class="file-input-widget_input"></b-form-file>
	</div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
// @ts-ignore
@Component({ name: 'FileInputWidget' })
export default class FileInputWidget extends Vue {
	@Prop({ type: String, default: '' })
	private placeholder!: string;

	@Prop({ type: String, default: '' })
	private dropPlaceholder!: string;

	private file: File | null = null;

	private get isState(): boolean {
		return this.file !== null;
	}

	private fileChanged() {
		this.$emit('input', this.file);
	}
}
</script>
<style lang="scss">
.file-input-widget {
	& > .custom-file {
		height: 100%;
		& > .custom-file-label {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			border-style: dashed;
			border-width: 4px;
			&::after {
				display: none;
			}
		}
	}
}
</style>
