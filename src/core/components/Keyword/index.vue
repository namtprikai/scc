<template>
	<div>
		{{questionId}}
		<b-list-group>
			<b-list-group-item
				v-for="keywordGroup in keywordGroups"
				:key="keywordGroup.id"
				class="d-block"
			>
				<p>
					<span v-for="(keyword, key) in keywordGroup.keywords" :key="key">
						<b-badge>{{ keyword.label }}</b-badge>
					</span>
				</p>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Emit } from "vue-property-decorator";
import { eventHub } from "@/init/eventHub";
import { AjaxService } from "../../services/ajax";
import {
	IKeywordData,
	IKeywordGroupData,
	IConditionGroupData,
	IConditionData,
} from "../../api/types";
import {
	Question
} from "../../api/question";
@Component
export default class KeywordComp extends Vue {
	fetchTime: number | null = null;

	@Prop()
	is_show!: boolean;
	@Watch("is_show")
	changeShow() {
		console.log("change");
		if (this.fetchTime === null) {
			this.fetch();
			this.fetchTime = new Date().getTime();
		}
	}
	@Prop()
	questionId!:number ;
	keywordGroups: Array<IKeywordGroupData> = [];


	async created() {}
	async fetch() {
		debugger;
		const data = await Question.getKeywordsByQuestionId(this.questionId);
		this.keywordGroups = data;
	}
}
</script>

<style lang="scss" scoped></style>
