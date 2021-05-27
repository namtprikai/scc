<template src="@/components/AllInOneScript/template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AllInOneScriptParent from '@/components/AllInOneScript';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: {
		botdion: () => import('@/components/TreeFile/index.vue'),
	},
})
export default class AllInOneScript extends AllInOneScriptParent {}
</script>
<style type="sass"></style>
<style type="scss" scoped></style>
