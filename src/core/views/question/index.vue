<template>
	<div>
		<TabHeader>
			<b-button
				class="ml-2"
				size="sm"
				variant="primary"
				@click="openSaveModal()"
				:disabled="isLoad"
				>反映ステップへ進む</b-button
			>
		</TabHeader>

		<div class="tab-body">
			<div>
				<b-form-group label="Using options array:">
					<b-form-checkbox-group
						id="checkbox-1"
						v-model="currentProducts"
						:options="ProductOptions"
						name="checkbox-1"
					>
					</b-form-checkbox-group>
				</b-form-group>
				<b-form-input
					type="text"
					placeholder="検索文"
					v-model="searchText"
				></b-form-input>
			</div>
			<div class="text-right mt-3">
				<b-button class @click="addRoot()" variant="secondary">
					<svg-icon name="arrows_plus" />
				</b-button>
			</div>
			<div>
				<wrap-sppiner v-if="isLoad" />
				<div v-for="(question, index) in Questions" :key="index">
					<BCardAccordion
						class="bot-message-config_editor_group section"
						:visible="false"
					>
						<template v-slot:header>
							<b-breadcrumb
								:items="[{ text: '親カテ' }, { text: '子カテ' }]"
							></b-breadcrumb>
							{{ question.title }}
						</template>
						<template v-slot:body="body">
							<Keyword :questionId="question.id" :is_show="body.isShow" />
							<Answer :questionId="question.id" :is_show="body.isShow" />
						</template>
					</BCardAccordion>
				</div>
				<div id="End"></div>
				<div class="mt-3">
					<b-button block class @click="addQuestion()" variant="secondary">
						<svg-icon name="arrows_plus" />
					</b-button>
					<BCardAccordion :title="'追加'" class :visible="false">
						<template slot="header"><div class="h3">ついか</div></template>
						<template slot="body">
							<b-form-group label-cols="4" label="質問文" label-for="question-value">
								<b-form-input
									id="question-value"
									size
									type="text"
									v-model="question_value"
									placeholder="質問文"
								></b-form-input>
							</b-form-group>
							<b-form-group label-cols="4" label="質問文" label-for="question-public">
								<b-form-checkbox
									id="question-public"
									v-model="question_isPublic"
									placeholder="質問文"
								></b-form-checkbox>
							</b-form-group>
							<b-button @click="addQuestion({is_public:question_isPublic,title:question_value})">追加する</b-button>
						</template>
					</BCardAccordion>
				</div>
				<div class="contextmenu" ref="contextmenu" v-show="contextMenuIsVisible">
					<div @click="removeNode">Remove</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="scss" scoped>
.dashboard {
	&-container {
		margin: 30px;
	}

	&-text {
		font-size: 30px;
		line-height: 46px;
	}
}
.emptyGif {
	display: block;
	width: 45%;
	margin: 0 auto;
}

.dashboard-editor-container {
	background-color: #e3e3e3;
	min-height: 100vh;
	padding: 50px 60px 0px;
	.pan-info-roles {
		font-size: 12px;
		font-weight: 700;
		color: #333;
		display: block;
	}
	.info-container {
		position: relative;
		margin-left: 190px;
		height: 150px;
		line-height: 200px;
		.display_name {
			font-size: 48px;
			line-height: 48px;
			color: #212121;
			position: absolute;
			top: 25px;
		}
	}
}
</style>
