<template src="@/components/AllInOneBot/template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AllInOneBotParent from '@/components/AllInOneBot';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: {
		botdion: () => import('@/components/TreeFile/bot.vue'),
	},
})
export default class AllInOneBot extends AllInOneBotParent {}
</script>
<style type="sass"></style>
<style type="scss" scoped></style>
