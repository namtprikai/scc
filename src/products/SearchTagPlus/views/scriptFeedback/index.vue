<template>
	<div>
		<b-row>
			<b-col lg="4" class="pb-2">
				<b-button v-on:click="save" class="mb-4">保存</b-button>
				<el-table v-loading="loadFlg" :data="FeedbackList" element-loading-text="Loading" border fit highlight-current-row @row-click="setFeedback">
					<el-table-column align="center" label="タイトル">
						<template slot-scope="scope">{{ scope.row.feedback.script_text }}</template>
					</el-table-column>
				</el-table>
			</b-col>
		</b-row>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import EditWrap from '@/components/EditWrap/index.vue';
import { apiUrl, scriptUrl, PRODUCT_ID, subsystemUrl } from './../../utils/configration';
import { Ajax } from '@/utils/parts';
import ScriptFeedbackParent from '../../../../core/views/scriptFeedback/index';
import { TalkScript, ScriptDataTree, TalkScriptModule, ParseTreeToList, ScriptDataTreeSearch } from '@/store/modules/talkScript';
// @ts-ignore
@Component({
	components: { EditWrap },
})
export default class ScriptFeedback extends ScriptFeedbackParent {}
</script>
<style type="scss" lang="scss" scoped></style>
