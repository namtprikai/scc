<template>
	<div>

	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
	components: {},
})
export default class CategoryTemp extends Vue {
@Prop()
title!:string;
}
</script>
