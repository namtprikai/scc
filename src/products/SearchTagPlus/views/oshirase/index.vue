<template>
	<div class="oshirase">
		<TabHeader>
			<b-button size="sm" v-on:click="upload" variant="primary"> <b-spinner small v-if="isUpload"></b-spinner>反映 </b-button>
		</TabHeader>
		<div class="tab-body">
			<b-alert show variant="info" v-if="discription">
				<span class="text-discription __Info" v-html="$sanitize(discription)"></span>
				<b-icon icon="info-circle" id="popover-target-1"></b-icon>
				<b-popover target="popover-target-1" triggers="hover" placement="top">
					<pre><code>{{tooltipText}}</code></pre>
				</b-popover>
			</b-alert>
			<div class="oshirase_wrapper">
				<div class="section">
					<b-card no-body>
						<b-card-header>
							<h3 class="h3">お知らせ1</h3>
							<span class="text-discription">最上部に流れて表示されます。</span>
						</b-card-header>
						<b-card-body>
							<b-textarea v-model="text"></b-textarea>
						</b-card-body>
					</b-card>
				</div>
				<div class="section">
					<b-card no-body>
						<b-card-header>
							<h3 class="h3">お知らせ2</h3>
							<span class="text-discription">最上部に固定で表示されます</span>
						</b-card-header>
						<b-card-body>
							<b-textarea v-model="link"></b-textarea>
						</b-card-body>
					</b-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { CLIENT_ID } from '../../utils/configration';
// import { debug } from 'util';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import clipboard from 'clipboard';
import FileuploadCompParent from '@/views/fileupload/index';
import axios from 'axios';
import { FileModule } from '@/store/modules/file';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
const Base64 = {
	encode: function(str: any) {
		return btoa(unescape(encodeURIComponent(str)));
	},
	decode: function(str: any) {
		return decodeURIComponent(escape(atob(str)));
	},
};
// @ts-ignore
@Component({
	filters: {
		statusFilter(status: string) {
			const statusMap: { [id: string]: string } = {
				published: 'success',
				draft: 'gray',
				deleted: 'danger',
			};
			return statusMap[status];
		},
	},
})
export default class Oshirase extends Vue {
	@Prop({ default: '' })
	private discription?: string;

	text = '';
	link = '';
	isUpload = false;

	private tooltipText = 'おしらせ2 には、簡単なHTML装飾が可能です。\n■ 例：リンク追加\n<a href="遷移したいリンク先URL">リンク表示したいテキスト</a>';

	created() {
		eventHub.$on('updateoshirase', this.setOshirase);
		this.updateOshirase();
	}

	destroy() {
		eventHub.$off('updateoshirase', this.setOshirase);
	}

	setOshirase({ text, link }: any) {
		this.text = text || '';
		this.link = link || '';
	}

	async upload() {
		this.isUpload = true;
		const base64Str: string = Base64.encode(JSON.stringify({ text: this.text, link: this.link }));
		await FileModule.postFile({
			parent: '',
			fileName: 'oshirase.json',
			type: 'list',
			base64Str,
		});
		this.isUpload = false;
		eventHub.$emit('updateoshirase', { text: this.text, link: this.link });
		this.$bvToast.toast('正常に反映しました', {
			// title: `挿入されました`,
			toaster: 'b-toaster-top-center',
			solid: true,
			appendToast: true,
		});
	}

	async updateOshirase() {
		try {
			const { data } = await axios.get(`https://file.ai-x-supporter.com/${CLIENT_ID}/oshirase.json`, {
				params: {
					h: Date.now(),
				},
			});
			console.log(data);
			this.text = data.text || '';
			this.link = data.link || '';
			// this.$forceUpdate();
		} catch (e) {}
	}
}
</script>
<style scoped>
.upload-image {
	width: 150px;
	height: 150px;
	border: solid 0.1px #999999;
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center center;
}
.upload-text {
	white-space: nowrap;
	width: 150px;
	font-size: 12px;
	margin: 0 5px 5px 0;
	text-overflow: ellipsis;
	overflow: hidden;
}
.upload-text-title {
	width: 150px;
	font-size: 10px;
	margin: 10px 0 5px 0;
	padding-left: 5px;
	border-bottom: thin dashed #4169e1;
	border-left: thin solid #4169e1;
}
.upload-list li {
	list-style: none;
	display: inline-block;
	margin-left: 10px;
}
.file {
	margin: 2px;
}
</style>
<style>
.modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 10;
	background: rgba(0, 0, 0, 0.7);
	transform: translate3d(0, 0, 0);
}
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}
.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}
.modal-container {
	width: 100%;
	margin: 0px auto;
	padding: 20px 30px;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
	margin-top: 0;
	color: #42b983;
}
.modal-body {
	margin: 20px 0;
}
.modal-enter {
	opacity: 0;
}
.modal-leave-active {
	opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
.appendix {
	font-size: 8px;
}
.file-table {
	font-size: 12px;
}
</style>
<style lang="scss" scoped>
.oshirase {
	&_discription {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	&_wrapper {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
	}
	&_textareas {
		margin: 32px 0;
	}
	&_textarea {
		padding: 8px 16px;
		border: 1px solid #c2c2c2;
		border-radius: 8px;
		&__label {
			margin-bottom: 8px;
		}
		&:nth-child(n + 2) {
			margin-top: 16px;
		}
	}
}
</style>
