<template>
	<div>
		<!-- <ul class="evaluation__ul">
			<li
				v-for="item in MessageList"
				v-on:click="setCurrentMessageById(item.id)"
				class="evaluation__ul__li"
				v-bind:key="item.id"
			>
				<div
					class="evaluation__ul__li__inner"
					v-bind:class="{'is_suspended':is_suspended}"
				>
					<div class="evaluation__ul__li__inner__body">
						<span class="evaluation__icon--question">Q.</span>
						<p class="evaluation__ul__li__inner__body__inner" v-if="item">{{item.query}}</p>
					</div>
					<div class="evaluation__ul__li__inner__buttonWrap">
						<div class="relCon">
							<button
								class="mdl-button evaluation__button evaluation__button--center"
								v-on:click="done2(item)"
							>登録済み</button>
						</div>
					</div>
				</div>
			</li>
			<li v-if="(getMessages()||[]).length<1" class="evaluation__ul__li">
				<div class="evaluation__ul__li__inner">
					<div class="evaluation__ul__li__inner__body">未登録メッセージが存在しません</div>
				</div>
			</li>
		</ul>-->
		<el-table v-loading="listLoading" :data="MessageList" element-loading-text="Loading" border fit highlight-current-row @row-click="setCurrentMessage">
			<el-table-column align="center" label="Q" width="95">
				<template slot-scope="scope">{{ scope.row.query }}</template>
			</el-table-column>

			<el-table-column align="center" label width="80">
				<template slot-scope="scope">
					<button class="mdl-button evaluation__button evaluation__button--center" v-on:click="done2(scope.row)">
						登録済み
					</button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import Tinymce from '@/components/Tinymce/index.vue';
import InputTag from '@/components/InputTag/index.vue';
import Synonym from '@/components/Synonym/index.vue';
import { Ajax, MessageObj, Message, MessageList } from '@/utils/parts';
import { subsystemUrl, PRODUCT_ID, script_logUrl } from './../../utils/configration';
import axios from 'axios';
import EvaluationCompParent from '../../../../core/views/evaluation/index';
// @ts-ignore
@Component({
	components: { Tinymce, InputTag, Synonym, },
})
export default class EvaluationComp extends EvaluationCompParent {}
</script>
<style type="scss" lang="scss" scoped></style>
