<template src="@/views/allInOneEditor/template.html"></template>
<style type="scss" lang="scss" scoped>
.question {
	position: relative;
	overflow: hidden;
	display: flex;
	.input {
		// float: left;
		display: flex;
		width: 100%;
	}
	.removeButton {
		display: flex;
		// float: right;
	}
	.vue-input-tag-wrapper {
		width: 100%;
	}
}
</style>

<script lang="ts">
import WrapMessage from '@/components/WrapMessage/index.vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import Tinymce from '@/components/Tinymce/index.vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import AllInOneEditorCompParent from '@/views/allInOneEditor';
import AnsewerEditor from "@/components/AnsewerEditor/index.vue";
// @ts-ignore
@Component({
	components: {
		Tinymce,
		InputTag,
		Synonym,
		WrapMessage,
		AnsewerEditor,
	},
})
export default class AllInOneEditorComp extends AllInOneEditorCompParent {}
</script>
