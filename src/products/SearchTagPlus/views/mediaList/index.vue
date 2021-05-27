<template>
	<div>
		<TabHeader>
			<b-button size="sm" v-b-toggle.collapse-3 class="mr-2">画像新規追加</b-button>
			<b-button size="sm" @click="reload()">リロード</b-button>
		</TabHeader>
		<div class="mb-3">
			<b-collapse id="collapse-3">
				<b-card center>
					<Upload />
				</b-card>
			</b-collapse>
		</div>
		<wrap-message v-if="isUpload" :message="message" />
		<div class="tab-body">
			<div>
				<b-input-group class="mb-2">
					<b-input-group-prepend is-text>
						<b-icon icon="search"></b-icon>
					</b-input-group-prepend>
					<b-form-input v-model="filterText" type="search" placeholder="ファイル名から絞り込む　※ファイル名に存在する文字列を入力してください"></b-form-input>
				</b-input-group>
			</div>

			<div class="fileUpload__upload-list">
				<div v-for="file in FileList" v-bind:key="file.Key" class="fileUpload__file card shadow-sm">
					<div class="fileUpload__upload-image" :style="{ backgroundImage: 'url(' + file.url + ')' }" v-on:click="imagemodal(file.url, file.Key)">
						<!-- <img class="upload-image" :src="file.url"> -->
					</div>
					<div class="fileUpload__body">
						<!-- <h2 class="fileUpload__upload-text-title">ファイル名:</h2> -->
						<div class="fileUpload__upload-text">{{ file.Key }}</div>
						<!-- <h2 class="fileUpload__upload-text-title">最終更新日:</h2> -->
						<div class="fileUpload__upload-text fileUpload__upload-text--date mt-1 text-right">
							{{ $moment(file.LastModified).format('YYYY-MM-DD') }}
						</div>
					</div>
					<div class="fileUpload__footer card-footer">
						<b-button
							inline
							size="sm"
							class="clipcopy"
							:data-clipboard-text="getUrl(file.Key)"
							title="クリップボードにコピーされます"
							@click="
								$bvToast.toast('クリップボードにコピーされました', {
									variant: 'info',
								})
							"
						>URLコピー</b-button
						>
						<b-button inline size="sm" v-on:click="deleate(file.Key)">削除</b-button>
					</div>
				</div>
			</div>
			<transition name="modal" v-if="confirmOpened">
				<div class="modal-mask">
					<div class="modal-wrapper">
						<div class="modal-container">
							<div class="modal-header">
								<h3>アップロード</h3>
							</div>
							<div class="modal-body">
								<p>次のファイルをアップロードします。</p>
								<table class="file-table" align="center">
									<tr>
										<th>ローカルファイル名</th>
										<th>リモートファイル名</th>
									</tr>
									<tr v-for="(uploadFile, i) in uploadFileList" :key="i">
										<td>{{ uploadFile.name }}</td>
										<td>
											<input type="text" v-model="fileNameList[i]" :placeholder="fileNameList[i].name" />
										</td>
									</tr>
								</table>

								<br />
								<br />
								<p class="appendix">
									※アップロード先でファイル名を変更する場合は、リモートファイル名に変更後の名前を入力してください。
									<br />(未入力の場合や、スペースのみ入力されている場合は、ローカルファイル名が使用されます)
								</p>
								<p class="appendix">
									※日本語、英数字(a～z,A～Z,0～9)、および、各種記号が利用できます。
									<br />(記号は「", ?, :, |, &lt;, >, *, \, スペース」以外のもの)
								</p>
								<p>よろしいですか？</p>
							</div>
							<div class="modal-footer">
								<b-button @click="cancel()">Cancel</b-button>
								<b-button @click="ok()">OK</b-button>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script lang="ts">
import { v4 } from 'uuid';
import { Component, Vue } from 'vue-property-decorator';
import { eventHub } from '@/init/eventHub';
import { FileModule } from '@/store/modules/file';
import { PRODUCT_ID } from '../../utils/configration';
// import { debug } from 'util';
import { ISlTreeNode, ISlTreeNodeModel } from 'sl-vue-tree';
import clipboard from 'clipboard';
import FileuploadCompParent from '@/views/fileupload/index';
import WrapMessage from '@/components/WrapMessage/index.vue';
import Upload from '../../components/fileupload/index.vue';
import { UserModule } from '@/store/modules/user';
// import "sl-vue-tree/dist/sl-vue-tree-minimal.css";
// @ts-ignore
@Component({
	components: { WrapMessage, Upload },
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
export default class MediaListComp extends FileuploadCompParent {

	public getUrl(fileName: string) {
		return `https://file.ai-x-supporter.com/${PRODUCT_ID}/${fileName}`;
	}
}
</script>
<style type="sass" lang="scss" src="@/views/fileupload/style.scss"></style>
<style type="sass" lang="scss" scoped src="@/views/fileupload/scopedstyle.scss"></style>
